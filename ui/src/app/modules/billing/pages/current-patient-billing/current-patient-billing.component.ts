import { Payment } from "src/app/modules/billing/models/payment.model";
import { keys } from "lodash";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Observable, of, zip } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { PatientService } from "src/app/shared/resources/patient/services/patients.service";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { ConfigsService } from "src/app/shared/services/configs.service";
import { BillObject } from "../../models/bill-object.model";
import { BillPayment } from "../../models/bill-payment.model";
import { Bill } from "../../models/bill.model";
import { PaymentInput } from "../../models/payment-input.model";
import { BillingService } from "../../services/billing.service";
import { PaymentService } from "../../services/payment.service";
import { select, Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation, getParentLocation } from "src/app/store/selectors";
import { DomSanitizer } from "@angular/platform-browser";
import { getCurrentUserDetails, getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { EncountersService } from "src/app/shared/services/encounters.service";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { any } from "cypress/types/bluebird";

@Component({
  selector: "app-current-patient-billing",
  templateUrl: "./current-patient-billing.component.html",
  styleUrls: ["./current-patient-billing.component.scss"],
})
export class CurrentPatientBillingComponent implements OnInit {
  loading: boolean;
  loadingError: string;
  patientVisit$: Observable<Visit>;
  currentLocation$: Observable<any>;
  patientId: string;
  facilityDetails$: Observable<any>;
  facilityLogo$: Observable<any>;
  facility: any;
  patientBillingDetails$: Observable<{
    visit: Visit;
    bills: Bill[];
    payments: Payment[];
    paymentItemCount: number;
    pendingPayments: BillPayment[];
  }>;
  currentPatient$: Observable<Patient>;
  parentLocation$: Observable<any>;
  currentUser$: Observable<any>;
  provider$: Observable<any>;
  creatingOrdersResponse$: Observable<any>;
  discountItems: any[] = [];
  discountItemsCount: any;
  bill: Bill;
  
  constructor(
    private route: ActivatedRoute,
    private visitService: VisitsService,
    private billingService: BillingService,
    private paymentService: PaymentService,
    private patientService: PatientService,
    private configService: ConfigsService,
    private encounterService: EncountersService,
    private ordersService: OrdersService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.patientId = this.route?.snapshot?.params?.patientId;
    this._getPatientDetails();

    this.currentPatient$ = this.patientService.getPatient(this.patientId);
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.facilityDetails$ = this.configService.getFacilityDetails();
    this.facilityLogo$ = this.configService.getLogo();
    this.facilityDetails$ = this.store.select(getParentLocation);
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation));
    this.provider$ = this.store.select(getProviderDetails);


    this.billingService.getAllPatientBills(this.patientId).subscribe({
      next: (bills) => {
        bills.forEach((bill) => {
          if(bill){
            this.bill = bill;
            //Get discounted Items
            let paidAmount: number = 0;
            let paidItems: any[];

            let givenItems: any[]

            bill.billDetails.discountItems.forEach((discountItem) => {
              //Get total amount that is already paid for an item
              bill.billDetails.payments.forEach((payment) => {
                paidItems = payment.items.filter((paymentItem) =>{
                  if(discountItem.item.uuid === paymentItem.item.uuid){
                    return paymentItem;
                  }
                }) 
              });
              
              //Get total amount of the item from the list of items the patient has
              givenItems = bill.billDetails.items.filter((givenItem) => {
                if(discountItem.item.uuid === givenItem.item.uuid){
                  return givenItem;
                }
              });

              //calculate total amount paid
              paidItems.forEach((paymentItem) => {
                paidAmount = paidAmount + paymentItem.amount;
              });

              // return discount item if paid amount is less than item's price
              if (paidAmount < givenItems[0].price){
                givenItems[0] = {
                  ...givenItems[0],
                  price: discountItem.amount
                }
                this.discountItems =  [
                  ...this.discountItems,
                  givenItems[0]
                ]  

              }
            });

            this.discountItemsCount = this.discountItems.length
            
          }
        })
      }
    });
  }

  private _getPatientDetails() {
    this.loading = true;

    this.patientBillingDetails$ = zip(
      this.visitService.getActiveVisit(this.patientId, false),
      this.billingService.getPatientBills(this.patientId),
      this.paymentService.getPatientPayments(this.patientId),
    ).pipe(
      map((res) => {
        this.loading = false;
        const visit = res[0];
        const bills = res[1];
        const payments = res[2];
        return {
          visit,
          bills: bills.filter((bill) => !bill.isInsurance),
          payments,
          paymentItemCount: payments
            .map((payment) => payment?.items?.length || 0)
            .reduce((sum, count) => sum + count, 0),
          pendingPayments: bills.filter((bill) => bill.isInsurance)
        };
      }),
      catchError((error) => {
        this.loadingError = error;
        this.loading = false;
        return of(null);
      })
    );
  }

  onConfirmBillPayment(results: {
    bill: BillObject;
    paymentInput: PaymentInput;
  }): void {}

  onPaymentSuccess() {
    this._getPatientDetails();
  }

  requestExemption(patientBillingDetails, params) {
    
    let currentDate = new Date();

    let exemptionEncounterStart = {
      visit: patientBillingDetails.visit?.uuid,
      encounterDatetime: currentDate.toISOString(),
      patient: params.currentPatient?.id,
      encounterType: "51130033-46fe-4fe5-b407-32413fb9acfa",
      location: params.currentLocation?.uuid,
      // TODO: Find best way to get encounter provider details
      encounterProviders: [
        {
          provider: params.provider?.uuid,
          encounterRole: "240b26f9-dd88-4172-823d-4a8bfeb7841f",
        },
      ],
    };

      // Format date to yyyy-mm-dd hh:mm:ss
    
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth()).length > 1 ? currentDate.getMonth()+1 : `0${currentDate.getMonth()+1}`
    let day = String(currentDate.getDate()).length > 1 ? currentDate.getDate() : `0${currentDate.getDate()}`
    let hours = String(currentDate.getHours()).length > 1 ? currentDate.getHours() : `0${currentDate.getHours()}`
    let minutes = String(currentDate.getMinutes()).length > 1 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`
    let seconds = String(currentDate.getSeconds()).length > 1 ? currentDate.getSeconds() : `0${currentDate.getSeconds()}`

    let formatedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // 1. Create encounter
    // 2. Use the encounter to create a requested order
    

    this.encounterService.createEncounter(exemptionEncounterStart).then((encounter) => {
      if (encounter){
        let order = {
          orderType: "3b4a9d58-0224-474f-a0f0-7fac80897b07",
          action: "NEW",
          urgency: "ROUTINE",
          encounter: encounter.uuid,
          careSetting: !patientBillingDetails.visit?.isAdmitted
            ? "OUTPATIENT"
            : "INPATIENT",
          patient: params.currentPatient?.id,
          concept: "be767d14-db83-40af-8de3-4a2f4e158712",
          orderer: params.provider?.uuid,
          type: "order"
        };
         
        // send a request to create order
        this.ordersService.createOrder(order).then((order) => {
          if (order) {
          } else {
            console.log(" ==> Failed exemption to create order: ", order);
          }
        });
      }
      
    });
  }

  onPrint(e: any): void {
    let contents: string;

    const frame1: any = document.createElement("iframe");
    frame1.name = "frame3";
    frame1.style.position = "absolute";
    frame1.style.width = "100%";
    frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);

    var frameDoc = frame1.contentWindow
      ? frame1.contentWindow
      : frame1.contentDocument.document
      ? frame1.contentDocument.document
      : frame1.contentDocument;

    frameDoc.document.open();

    frameDoc.document.write(`
      <html>
        <head> 
          <style> 
              @page { size: auto;  margin: 0mm; }
              
              body {
                padding: 30px;
                margin: 0 auto;
                width: 100mm;
              }

              #top .logo img{
                //float: left;
                height: 100px;
                width: 100px;
                background-size: 100px 100px;
              }
              .info h2 {
                font-size: 1.3em;
              }
              h3 {
                font-size: 1em;
              }
              h5 {
                font-size: .7em;
              }
              p {
                font-size: .7em;
              }
              #table {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
                background-color: #000;
              } 
              #table td, #table  th {
                border: 1px solid #ddd;
                padding: 5px;
              } 
              
              #table tbody tr:nth-child(even){
                background-color: #f2f2f2;
              } 

              #table thead tr th { 
                padding-top:6px; 
                padding-bottom: 6px; 
                text-align: left; 
                background-color: #cecece;
                font-size: .7em;
              }
              tbody tr td {
                font-size: .7em;
              }
              .footer {
                margin-top:50px
              }
              .footer .userDetails .signature {
                margin-top: 20px;
              }
          </style>
        </head>
        <body> 
         <div id="printOut">
        `);

    // Change image from base64 then replace some text with empty string to get an image

    let image = "";

    e.FacilityDetails.attributes.map((attribute) => {
      let attributeTypeName =
        attribute && attribute.attributeType
          ? attribute?.attributeType?.name.toLowerCase()
          : "";
      if (attributeTypeName === "logo") {
        image = attribute?.value;
      }
    });

    let patientMRN =
      e.CurrentPatient.MRN ||
      e.CurrentPatient.patient?.identifiers[0]?.identifier.replace(
        "MRN = ",
        ""
      );

    frameDoc.document.write(`
    
      <center id="top">
        <div class="logo">
          <img src="${image}" alt="Facility's Logo"> 
        </div>
        

        <div class="info">
          <h2>${e.FacilityDetails.display}</h2>
          <h3>P.O Box ${e.FacilityDetails.postalCode} ${e.FacilityDetails.stateProvince}</h3>
          <h3>${e.FacilityDetails.country}</h3>
        </div>
        <!--End Info-->
      </center>
      <!--End Document top-->
      
      
      <div id="mid">
        <div class="patient-info">
          <p> 
              Patient Name : ${e.CurrentPatient.name}</br>
          </p>
          <p> 
              MRN : ${patientMRN}</br>
          </p>
        </div>
      </div>`);

    //For paid items
    if (e.Payments) {
      if (e.Payments.length > 0) {
        frameDoc.document.write(`
        <div>
          <h5>Paid Items</h5>
        </div>
        <table id="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Amount</th>
              <th>Date paid</th>
            </tr>
          </thead>
          <tbody>`);

        e.Payments.forEach((payment) => {
          payment.items.forEach((item) => {
            let paymentDate = new Date(payment.created);
            // Date to string
            let date_paid = `${
              paymentDate.getDate().toString().length > 1
                ? paymentDate.getDate()
                : "0" + paymentDate.getDate()
            }-${
              paymentDate.getMonth().toString().length > 1
                ? paymentDate.getMonth()
                : "0" + paymentDate.getMonth()
            }-${paymentDate.getFullYear()}`;
            contents = `
                <tr>
                  <td>${item.name}</td> 
                  <td>${item.amount}</td>  
                  <td>${date_paid}</td>
                </tr>`;
            frameDoc.document.write(contents);
          });
        });

        frameDoc.document.write(`
          </tbody>
        </table>`);
      }
    }

    //For bills
    if (e.Bill) {
      if (e.Bill.length > 0) {
        frameDoc.document.write(`
        <div>
          <h5>Unpaid Items</h5>
        </div>
        <table id="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
        <tbody>`);

        e.Bill.forEach((bill) => {
          bill.items.forEach((record) => {
            contents = `
            <tr>
              <td>${record.name}</td> 
              <td>${record.quantity}</td> 
              <td>${record.amount}</td>
            </tr>`;
            frameDoc.document.write(contents);
          });
        });

        frameDoc.document.write(`
          </tbody>
        </table>`);
      }
    }

    frameDoc.document.write(`
          <div class="footer">
            <div class="userDetails">
              <p class="name">Printed By: ${e.CurrentUser?.person?.display}</p>
              <p class="signature">Signature : ..............................</p>
            </div>

            <div class=""printDate>
              <p>Printed on: ${e.PrintingDate}</p>
            </div>
          </div>
        </div>
      </body>
    </html>`);

    frameDoc.document.close();

    setTimeout(function () {
      window.frames["frame3"].focus();
      window.frames["frame3"].print();
      document.body.removeChild(frame1);
    }, 500);
  }
}
