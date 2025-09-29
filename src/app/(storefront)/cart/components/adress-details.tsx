"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import Loading from '../../loading';

const CheckoutDialog = ({ data, totalPrice }: { data: CartItem[], totalPrice: number }) => {
  const cart = useCart();

  const [nom, setNom] = useState('');
  const [prenom, setNomUtilisateur] = useState('');
  const [address, setAddress] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [moyenPaiement, setMoyenPaiement] = useState('');
  const [email, setemail] = useState('');
  const [telephone, settelephone] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isDone, setisDone] = useState(false);

  // single, correct validator: address required, postal code NOT required
  const validateForm = () => {
    return (
      nom.trim() !== '' &&
      prenom.trim() !== '' &&
      email.trim() !== '' &&
      telephone.trim() !== '' &&
      address.trim() !== '' &&
      moyenPaiement.trim() !== ''
    );
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        toast.error('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      setisLoading(true);

      const response = await axios.post('/api/checkout', {
        nom,
        prenom,
        address,
        codePostal,       // optional
        moyenPaiement,
        email,
        telephone,
        totalPrice,
        data,
        articlesPanier: data.filter((e) => 'id' in e && !('packId' in e)),
        pcOrder: data.filter((e) => 'idd' in e && !('packId' in e)),
      });

      console.log('Validation de la commande réussie :', response.data);
      setisLoading(false);
      setisDone(true);
      cart.removeAll();
    } catch (error) {
      setisLoading(false);
      console.error('Échec de la validation de la commande :', error);
    }
  };

  return (
    <div>
<Dialog modal={false} onOpenChange={() => { setisDone(false) }}>        <DialogTrigger asChild>
          <Button
            disabled={data.length === 0}
            className="w-full mt-6 bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] text-lg"
          >
            Checkout
          </Button>
        </DialogTrigger>

        <DialogContent className="relative top-0 lg:min-w-[80%] h-[100vh] overflow-y-scroll sm:h-4/6 sm:overflow-y-hidden overflow-visible min-w-[100%] bg-card border border-border">
        <div className="h-[120vh] sm:h-full">
            {isDone ? (
              <div className="w-full h-full flex align-middle justify-center items-center">
                <div className="font-extrabold flex flex-col text-[#00e0ff] text-3xl align-middle justify-center items-center">
                  <img src="/images/Done1.gif" alt="Your GIF" />
                  Your order is complete!
                </div>
              </div>
            ) : !isLoading ? (
              <div>
                <DialogHeader>
                  <DialogTitle className="text-foreground">Order Validation</DialogTitle>
                  <DialogDescription className="text-foreground/70">
                    Enter your details to validate your order. Click Save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-6">
                  {/* Left column */}
                  <div>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nom" className="text-right text-foreground">
                          First Name*
                        </Label>
                        <Input
                          id="nom"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          className="col-span-3 border border-border bg-card/10 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring focus:outline-none rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prenom" className="text-right text-foreground">
                          Last Name*
                        </Label>
                        <Input
                          id="prenom"
                          value={prenom}
                          onChange={(e) => setNomUtilisateur(e.target.value)}
                          className="col-span-3 border border-border bg-card/10 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring focus:outline-none rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right text-foreground">
                          Email*
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setemail(e.target.value)}
                          className="col-span-3 border border-border bg-card/10 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring focus:outline-none rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="telephone" className="text-right text-foreground">
                          Phone Number*
                        </Label>
                        <Input
                          id="telephone"
                          value={telephone}
                          onChange={(e) => settelephone(e.target.value)}
                          className="col-span-3 border border-border bg-card/10 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring focus:outline-none rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right text-foreground">
                        Address*
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="col-span-3 border-border bg-card/70 text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--accent))]"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="codePostal" className="text-right text-foreground">
                        Postal Code
                      </Label>
                      <Input
                        id="codePostal"
                        value={codePostal}
                        onChange={(e) => setCodePostal(e.target.value)}
                        placeholder="Postal code (optional)"
                        className="col-span-3 border-border bg-card/70 text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--accent))]"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="moyenPaiement" className="text-right text-foreground">
                        Payment Method*
                      </Label>
                      <Select onValueChange={setMoyenPaiement}>
  <SelectTrigger className="col-span-3 border-border bg-card/70 text-foreground">
    <SelectValue placeholder="Choisir le mode de paiement" />
  </SelectTrigger>
  <SelectContent className="bg-[#12141b] border border-border">
    <SelectItem value="sur_place" className="text-foreground hover:bg-white/10">
      Paiement sur place
    </SelectItem>
    <SelectItem value="ala_livraison" className="text-foreground hover:bg-white/10">
      Paiement à la livraison
    </SelectItem>
  </SelectContent>
</Select>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" onClick={handleSubmit}>
                    Valider
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutDialog;
