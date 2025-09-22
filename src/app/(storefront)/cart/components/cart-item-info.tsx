interface CartItemInfoProps {
  product: Record<string, any>;
}

const CartItemInfo: React.FC<CartItemInfoProps> = ({
  product
}) => {
  return ( 
    <div>
      <div className="flex justify-between">
        <p className=" text-sm font-semibold text-foreground">
          {product.name}
        </p>
      </div>

      <div className="mt-1 flex text-sm">
        <p className="text-muted-foreground">{product.color}</p>
        <p className="ml-4 border-l border-border pl-4 text-muted-foreground">{product.size}</p>
      </div>
      <p className="mt-1 text-sm font-medium text-foreground">{product.price}</p>
    </div>
  );
}
 
export default CartItemInfo;
