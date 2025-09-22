const NoResults = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-foreground/70 text-lg py-12">
      <div className="text-6xl mb-4">🔍</div>
      <div>No results found.</div>
      <div className="text-sm text-foreground/50 mt-2">Try adjusting your search criteria</div>
    </div>
  );
};

export default NoResults;
