"use client"
import { CartItem } from '@/hooks/use-cart';
import React, { useRef } from 'react';
import './facture.css'
import { Order } from '@prisma/client';
import Image from 'next/image';
import html2pdf from 'html2pdf.js';
const Invoice = (props: { invoiceData: any[]; order: Order | null }) => {
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
    <div  className='container bg-card border border-border py-5 rounded-lg my-5'>
      <div ref={invoiceRef} id='your-invoice-element-id' className='bg-card p-3'  >   <h1 className='text-3xl font-bold text-[hsl(var(--accent))]'>Invoice</h1>
      <button onClick={generatePDF} className="mt-2 rounded-md bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] px-4 py-2 text-black font-semibold hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] transition">Export as PDF</button>

      {order?<>
        <div>
        <div className='font-extrabold mt-3'>Seller</div>
      <div className='flex items-center font-bold text-lg'>  <Image className='mr-3' alt='logo' width={50} height={50} src={'/images/logo (3).png'}/> Gaming Gear TN</div>
        </div>
        <div className='font-extrabold mt-3'>Client</div>
         <div className='flex items-center '>firstname & lastname   : {order.name} {order.lastName}</div>
      <div className='flex items-center'>E-mail address : {order.email}</div>
      <div className='flex items-center'>Phone number : {order.phone}</div>
      <div className='flex items-center'>Address : {order.address}</div>
        <div>
        Date: <br /> {order.createdAt.toLocaleString()}
        </div>
      
      
      </>:<></>}
     
      <div className=' my-3 relative overflow-x-auto shadow-md sm:rounded-lg bg-card border border-border'>
        <table className="tt py-5 border w-full text-md text-left sm:rounded-t-lg rtl:text-right text-muted-foreground">
          <thead className='  text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr className=' border-b text-lg'>
                    
              <th  scope="col" className="px-6 py-3 " >Product Name</th>
              <th  scope="col" className="px-6 py-3" >Quantity</th>
              <th  scope="col" className="px-6 py-3" >Unit price</th>
              <th  scope="col" className="px-6 py-3">Total (in TND)</th>
            </tr>
          </thead>
          <tbody>
            {props.invoiceData.map((item: CartItem, index) => (
              <React.Fragment key={index}>
{
  "packId"in item ? <>
  {
                  "idd" in item ? <>
                    <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]'>
                     <td className='px-6 py-4 font-extrabold'>{item.Title}</td>
                      <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.price}</td>
                     <td className='px-6 py-4'>{item.price}</td></tr>
{item.defaultKeyboard?<>

  <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                     <td className='px-6 py-4'><b>Keyboard:</b> {item.defaultKeyboard.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.defaultKeyboard.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
</>:<></>

}
{item.defaultMouse?<>

<tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                  
                   <td className='px-6 py-4'><b>Mouse:</b> {item.defaultMouse.name} </td>
                   <td className='px-6 py-4'>X1</td>
                   <td className='px-6 py-4'>{item.defaultMouse.price} </td>
                   <td className='px-6 py-4'></td>
                  </tr>
</>:<></>

}    
{item.defaultHeadset?<>

<tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                  
                   <td className='px-6 py-4'><b>Headset:</b> {item.defaultHeadset.name} </td>
                   <td className='px-6 py-4'>X1</td>
                   <td className='px-6 py-4'>{item.defaultHeadset.price} </td>
                   <td className='px-6 py-4'></td>
                  </tr>
</>:<></>

}  
{item.defaultMousePad?<>

<tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                  
                   <td className='px-6 py-4'><b>Mousepad:</b> {item.defaultMousePad.name} </td>
                   <td className='px-6 py-4'>X1</td>
                   <td className='px-6 py-4'>{item.defaultMousePad.price} </td>
                   <td className='px-6 py-4'></td>
                  </tr>
</>:<></>

}  
{item.defaultMics?<>

<tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                  
                   <td className='px-6 py-4'><b>Microphone:</b> {item.defaultMics.name} </td>
                   <td className='px-6 py-4'>X1</td>
                   <td className='px-6 py-4'>{item.defaultMics.price} </td>
                   <td className='px-6 py-4'></td>
                  </tr>
</>:<></>

}  
{item.defaultCamera?<>

<tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]'>
                  
                   <td className='px-6 py-4'><b>Camera:</b> {item.defaultCamera.name} </td>
                   <td className='px-6 py-4'>X1</td>
                   <td className='px-6 py-4'>{item.defaultCamera.price} </td>
                   <td className='px-6 py-4'></td>
                  </tr>
</>:<></>

}           
{item.defaultScreen?<>

<tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                  
                   <td className='px-6 py-4'><b>Screen:</b> {item.defaultScreen.name} </td>
                   <td className='px-6 py-4'>X1</td>
                   <td className='px-6 py-4'>{item.defaultScreen.price} </td>
                   <td className='px-6 py-4'></td>
                  </tr>
</>:<></>

}  
{item.DefaultChair?<>

<tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                  
                   <td className='px-6 py-4'><b>Gaming Chair:</b> {item.DefaultChair.name} </td>
                   <td className='px-6 py-4'>X1</td>
                   <td className='px-6 py-4'>{item.DefaultChair.price} </td>
                   <td className='px-6 py-4'></td>
                  </tr>
</>:<></>

}   
{item.DefaultManette?<>

<tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                  
                   <td className='px-6 py-4'><b>Conroller :</b> {item.DefaultManette.name} </td>
                   <td className='px-6 py-4'>X1</td>
                   <td className='px-6 py-4'>{item.DefaultManette.price} </td>
                   <td className='px-6 py-4'></td>
                  </tr>
</>:<></>

}      
{item.DefaultSpeaker?<>

<tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                  
                   <td className='px-6 py-4'><b>Speaker:</b> {item.DefaultSpeaker.name} </td>
                   <td className='px-6 py-4'>X1</td>
                   <td className='px-6 py-4'>{item.DefaultSpeaker.price} </td>
                   <td className='px-6 py-4'></td>
                  </tr>
</>:<></>

}        
                <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                     <td className='px-6 py-4 font-extrabold'></td>
                      <td className='px-6 py-4'></td>
                     <td className='px-6 py-4'>-{item.reduction}</td>
                     <td className='px-6 py-4'></td></tr>
                  </> : <>
                 
                  </>

                }
  
  
  </>:<>
  {
                  "idd" in item ? <>
                    <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                     <td className='px-6 py-4 font-extrabold'>{item.Title}</td>
                      <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.price}</td>
                     <td className='px-6 py-4'>{item.price}</td></tr>

                  <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                     <td className='px-6 py-4'><b>Motherboard:</b> {item.motherboard.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.motherboard.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                     <td className='px-6 py-4'><b>Processor:</b>{item.processor.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.processor.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                     <td className='px-6 py-4'><b>Graphics Card:</b>{item.gpu?.name || 'N/A'} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.gpu?.price || 0} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                     <td className='px-6 py-4'><b>Case:</b>{item.case.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.case.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                     <td className='px-6 py-4'><b>power supply:</b>{item.power.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.power.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                  <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                     <td className='px-6 py-4'><b>RAM:</b><br />
                        {item.ram.map((e) => <>{e.name}<br /></>)} </td>
                     <td className='px-6 py-4'><br />
                        {item.ram.map((e) => <>X1<br /></>)}
                      </td>
                     <td className='px-6 py-4'><br />
                        {item.ram.map((e) => <>{e.price}<br /></>)}</td>
                     <td className='px-6 py-4'></td>

                    </tr>
                  <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                     <td className='px-6 py-4'><b>Primary Storage:</b>{item.disk.name} </td>
                     <td className='px-6 py-4'>X1</td>
                     <td className='px-6 py-4'>{item.disk.price} </td>
                     <td className='px-6 py-4'></td>
                    </tr>
                    {
                      item.disk2 ? <>
                      <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                         <td className='px-6 py-4'><b>Secondary Storage:</b>{item.disk2.name} </td>
                         <td className='px-6 py-4'>X1</td>
                         <td className='px-6 py-4'>{item.disk2.price} </td>
                         <td className='px-6 py-4'></td>
                        </tr>
                      </> : <></>
                    }
                    {
                      item.cooling ? <>
                      <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                         <td className='px-6 py-4'><b>CPU cooler:</b>{item.cooling.name} </td>
                         <td className='px-6 py-4'>X1</td>
                         <td className='px-6 py-4'>{item.cooling.price} </td>
                         <td className='px-6 py-4'></td>
                        </tr>
                      </> : <></>
                    }
                    {
                      item.screen ? <>
                      <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                         <td className='px-6 py-4'><b>Screen:</b>{item.screen.name} </td>
                         <td className='px-6 py-4'>X1</td>
                         <td className='px-6 py-4'>{item.screen.price} </td>
                         <td className='px-6 py-4'></td>
                        </tr>
                      </> : <></>
                    }
                <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                     <td className='px-6 py-4 font-extrabold'></td>
                      <td className='px-6 py-4'></td>
                     <td className='px-6 py-4'>-{item.reduction}</td>
                     <td className='px-6 py-4'></td></tr>
                  </> : <>
                  <tr className='bg-card border-b border-border hover:bg-[hsl(var(--card)/0.08)]' >
                    
                     <td className='px-6 py-4'>{item.name}</td>
                     <td className='px-6 py-4'>X{item.number}</td>
                     <td className='px-6 py-4'>{item.price}</td>
                     <td className='px-6 py-4'>{item.price * item.number}</td></tr>
                  </>

                }
  </>
}
                <> 
                </> </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-card border-t border-border">
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

const calculateTotal = (items: any[]) => {
  return items.reduce(
    (total, item: any) => total + (item.number ?? 1) * (item.price ?? 0),
    0
  );
};
export default Invoice;
