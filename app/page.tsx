export default async function Page() {
  return (
    <div className="flex justify-center flex-col items-center mt-4 gap-4">
      <h1 className="text-xl">Welcome!</h1>
      <p>
        Enter the cfx id or cfx.re url! Here are some possible examples:
        <br /> - cfx.re/join/ID <br />
        - ID <br />- cfx.re/ID
      </p>
    </div>
  );
}
