import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useCart, { CartItem } from '@/hooks/use-cart';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import Loading from '../../loading';

const CheckoutDialog = ({ data ,totalPrice}: { data: CartItem[],totalPrice:number }) => {

  const cart=useCart()
  const [nom, setNom] = useState('');
  const [prenom, setNomUtilisateur] = useState('');
  const [rue, setRue] = useState('');
  const [ville, setVille] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [moyenPaiement, setMoyenPaiement] = useState('');
  const [email, setemail] = useState('');
  const [telephone, settelephone] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isDone, setisDone] = useState(false);
  const validateForm = () => {
    // Add your validation logic here
    return nom.trim() !== '' && prenom.trim() !== '' && rue.trim() !== '' && ville.trim() !== '' && codePostal.trim() !== '' && moyenPaiement.trim() !== '';
  };

  const handleSubmit = async () => {
    try {
   
      // Validate the form before submitting
      if (!validateForm()) {
        console.error('Veuillez remplir tous les champs obligatoires.');
        toast.error('Veuillez remplir tous les champs obligatoires.')
        return;
      }
      setisLoading(true)
      // Envoyer les données au serveur ou effectuer d'autres actions
      const response = await axios.post('/api/checkout', {
        nom,
        prenom,
        rue,
        ville,
        codePostal,
        moyenPaiement,
        email,
        telephone,
        totalPrice,
        data,
        articlesPanier: data.filter((e)=>'id'in e&& !('packId' in e)),
        pcOrder: data.filter((e)=>'idd'in e&&!('packId' in e)),
      });
        
      console.log('Validation de la commande réussie :', response.data);
      setisLoading(false)
      setisDone(true)
      cart.removeAll()
      // Fermer la boîte de dialogue ou naviguer vers l'étape suivante
    } catch (error) {
      setisLoading(false)
      console.error('Échec de la validation de la commande :', error);
    }
  };

  return (
    <div>
      <Dialog onOpenChange={()=>{setisDone(false)}}>
        <DialogTrigger asChild >
          <Button disabled={data.length === 0} className="w-full mt-6 dark:bg-purple-500 bg-purple-500  hover:bg-purple-500/80 dark:hover:bg-purple-500/80 font-semibold text-lg dark:text-white">Passer à la caisse</Button>
        </DialogTrigger>
        <DialogContent className="relative top-0 lg:min-w-[80%] h-[100vh] overflow-y-scroll sm:h-4/6 sm:overflow-y-hidden min-w-[100%]   ">
          <div className='h-[120vh] sm:h-full '>
            {
              isDone?<>
              <div className='w-full h-full flex align-middle justify-center items-center'>
                <div className='font-extrabold flex flex-col text-[#77b43f] text-3xl align-middle justify-center items-center' >    <img src="/images/Done1.gif" alt="Your GIF" />
                
         Votre commande est complète!
                </div>
          
              </div>
              
            
              </>:<>
              {
  !isLoading? <>     <div>
   
            <DialogHeader>
            <DialogTitle>Validation de la commande</DialogTitle>
            <DialogDescription>
              Saisissez vos détails pour la validation de la commande. Cliquez sur Enregistrer lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>

          <div className='grid  grid-cols-1 sm:grid-cols-2 items-start gap-2'>
            <div>
            <div className="grid gap-4 py-4 ">
                <div className="grid grid-cols-4 items-center gap-4">
              
                <Label htmlFor="nom" className="text-right">
                  Nom*
                </Label>
                <Input
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="col-span-3"
                />
              </div>     </div>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prenom" className="text-right">
                Prénom*
              </Label>
              <Input
                id="prenom"
                value={prenom}
                onChange={(e) => setNomUtilisateur(e.target.value)}
                className="col-span-3"
              />
            </div>  </div>
                       
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nom" className="text-right">
                    Email*
                  </Label>
                  <Input
                  type='email'
                    id="nom"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nom" className="text-right">
                    Numero de téléphone*
                  </Label>
                  <Input
                    id="nom"
                    value={telephone}
                    onChange={(e) => settelephone(e.target.value)}
                    className="col-span-3"
                  />
                </div>
            </div>
   

            <div className="grid gap-4 py-4">

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rue" className="text-right">
                  Rue*
                </Label>
                <Input
                  id="rue"
                  value={rue}
                  onChange={(e) => setRue(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ville" className="text-right">
                  Ville*
                </Label>
                <Input
                  id="ville"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="codePostal" className="text-right">
                  Code postal*
                </Label>
                <Input
                  id="codePostal"
                  value={codePostal}
                  onChange={(e) => setCodePostal(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="moyenPaiement" className="text-right">
                  Moyen de paiement*
                </Label>
                <Select  onValueChange={setMoyenPaiement} >
                  <SelectTrigger className="w-full col-span-3">
                    <SelectValue className="w-full" placeholder="Moyen de paiement" />
                  </SelectTrigger>
                  <SelectContent className="col-span-3">
                    <SelectGroup>
                      <SelectItem value="apple">à La Livraison</SelectItem>
                      <SelectItem value="banana">Carte Bancaire</SelectItem>
                      <SelectItem value="blueberry">Chèque</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Valider
            </Button>
          </DialogFooter>
            </div></>:<>
            <Loading/>
            
            </>
}
              </>
            }

       

       
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutDialog;
