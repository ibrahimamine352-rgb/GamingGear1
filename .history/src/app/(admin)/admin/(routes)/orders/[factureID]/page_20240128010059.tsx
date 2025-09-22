"use client"
import { CartItem } from '@/hooks/use-cart';
import React, { useRef } from 'react';
import './facture.css'
import { Order } from '@prisma/client';
import Image from 'next/image';
import html2pdf from 'html2pdf.js';
const Invoice = (props: { invoiceData: CartItem[] ,order:Order|null}) => {
  const order=props.order
  const invoiceRef = useRef(null);
  const generatePDF = () => {
    const pdfOptions = {
      margin: 10,
      filename: order?order.name+order.lastName+"-":""+'facture.pdf',
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    const isDarkMode = document.documentElement.classList.contains('dark');

    const invoiceElement = document.getElementById('your-invoice-element-id');
  

    if (invoiceElement) {

      if (isDarkMode) {
        document.documentElement.classList.remove('dark');
      }
      try {
        html2pdf().from(invoiceElement).set(pdfOptions).save();
        
      } catch (error) {
        
      }finally{
        setTimeout(() => {
          if (isDarkMode) {
            document.documentElement.classList.add('dark');
          }
        }, 0.0000001);
      }
    
      // Generate PDF and save it
    


    
    } else {
      console.error('Invoice element not found');
    }
  };
  
  return (
    <div  className='container bg-white dark:bg-slate-950 py-5 rounded-lg my-5'>
      <div ref={invoiceRef} id='your-invoice-element-id' className='bg-white dark:bg-slate-950 p-3'  >   <h1 className='text-3xl font-bold text-amber-500 dark:text-amber-400'>Facture</h1>
      <button onClick={generatePDF}>Export as PDF</button>

      {order?<>
        <div>
        <div className='font-extrabold mt-3'>Vendeur</div>
      <div className='flex items-center font-bold text-lg'>  <Image className='mr-3' alt='logo' width={50} height={50} src={'/images/logo (3).png'}/> Gaming Gear TN</div>
        </div>
        <div className='font-extrabold mt-3'>Client</div>
         <div className='flex items-center '>nom & prénom   : {order.name} {order.lastName}</div>
      <div className='flex items-center'>Adresse E-mail : {order.email}</div>
      <div className='flex items-center'>Numéro telephone : {order.phoneNumber}</div>
      <div className='flex items-center'>Address : {order.address}</div>
        <div>
        Date: <br /> {order.createdAt.toLocaleString()}
        </div>
      
      
      </>:<></>}
     
      <div className=' my-3 border-gray-200 relative overflow-x-auto shadow-md sm:rounded-lg  '>
        <table className="tt py-5 border w-full text-md text-left sm:rounded-t-lg rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className='  text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr className=' border-b text-lg'>
                    
              <th  scope="col" className="px-6 py-3 " >Nom de produit</th>
              <th  scope="col" className="px-6 py-3" >Quantité</th>
              <th  scope="col" className="px-6 py-3" >Prix unitaire</th>
              <th  scope="col" className="px-6 py-3">Total (en TND)</th>
            </tr>
          </thead>
          <tbody>
            {props.invoiceData.map((item: CartItem, index) => (
              <React.Fragment key={index}>

                <> {
                  "idd" in item ? <>
                    <tr className='bg-white  border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                     <td className='px-6 py-4 font-extrabold'>Pc par command</td>
                      <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.price}</td>
                     <td className='px-6 py-4'>{item.price}</td></tr>

                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                     <td className='px-6 py-4'><b>Carte Mére:</b> {item.motherboard.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.motherboard.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                     <td className='px-6 py-4'><b>Processeur:</b>{item.processor.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.processor.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                     <td className='px-6 py-4'><b>Carte Grapfique:</b>{item.gpu.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.gpu.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                     <td className='px-6 py-4'><b>Boitier:</b>{item.case.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.case.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                     <td className='px-6 py-4'><b>Bloc d'alimentation:</b>{item.power.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.power.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                     <td className='px-6 py-4'><b>Ram:</b><br />
                        {item.ram.map((e) => <>{e.name}<br /></>)} </td>
                     <td className='px-6 py-4'><br />
                        {item.ram.map((e) => <>X1<br /></>)}
                      </td>
                     <td className='px-6 py-4'><br />
                        {item.ram.map((e) => <>{e.price}<br /></>)}</td>
                     <td className='px-6 py-4'></td>

                    </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                     <td className='px-6 py-4'><b>Stockage Principal:</b>{item.disk.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.disk.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                    {
                      item.disk2 ? <>
                      <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                         <td className='px-6 py-4'><b>Stockage Secondaire:</b>{item.disk2.name} </td>
                         <td className='px-6 py-4'>X1</td>
                         <td className='px-6 py-4'>{item.disk2.price} </td>
                         <td className='px-6 py-4'></td>
                        </tr>
                      </> : <></>
                    }
                    {
                      item.cooling ? <>
                      <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                         <td className='px-6 py-4'><b>Refroidisseur CPU:</b>{item.cooling.name} </td>
                         <td className='px-6 py-4'>X1</td>
                         <td className='px-6 py-4'>{item.cooling.price} </td>
                         <td className='px-6 py-4'></td>
                        </tr>
                      </> : <></>
                    }
                    {
                      item.screen ? <>
                      <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                         <td className='px-6 py-4'><b>Ecran:</b>{item.screen.name} </td>
                         <td className='px-6 py-4'>X1</td>
                         <td className='px-6 py-4'>{item.screen.price} </td>
                         <td className='px-6 py-4'></td>
                        </tr>
                      </> : <></>
                    }
                
                  </> : <>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' >
                    
                     <td className='px-6 py-4'>{item.name}</td>
                     <td className='px-6 py-4'>X{item.number}</td>
                     <td className='px-6 py-4'>{item.price}</td>
                     <td className='px-6 py-4'>{item.price * item.number}</td></tr>
                  </>

                }
                </> </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className=" bg-white dark:bg-gray-950 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-3 text-base">Total</th>
                <td className="px-6 py-3">X{props.invoiceData.length}</td>
                <td></td>
                <td className="px-6 py-3"> {calculateTotal(props.invoiceData)}</td>
            </tr>
        </tfoot>
        </table>     </div>

    
    </div></div>
   
  );
};

const calculateTotal = (items: CartItem[]) => {


  return items.reduce((total, item) => total + item.number * item.price, 0);
};

export default Invoice;
