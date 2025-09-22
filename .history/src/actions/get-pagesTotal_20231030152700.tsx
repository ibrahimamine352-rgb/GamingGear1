
const gettoatl = async (keyword: string): Promise<number> => {

    const res = await fetch(`./api`);
  
    return res.json();
  };
  
  export default gettoatl;
  