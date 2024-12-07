// TODO: Add styling for the not found page
const LookupNotFound = () => {
  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <h1 className="select-none text-center text-6xl tracking-widest">404</h1>
      <p className="mt-2 text-center">No server could be found with this ID.</p>
    </div>
  );
};

export default LookupNotFound;
