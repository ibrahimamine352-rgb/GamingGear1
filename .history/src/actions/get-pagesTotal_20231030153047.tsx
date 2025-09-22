
const gettoatl = async (keyword: string): Promise<number> => {

    const res = await fetch(`./api/pagestotale`);
  
    return res.json();
  };
  
  export default gettoatl;
  