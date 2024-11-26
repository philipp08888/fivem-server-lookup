import { Tag } from "@/src/components/Tag";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 mt-4">
        <Tag>How To - Explanation</Tag>
        <p>
          Hello, to start a server lookup, you have to enter the respective Id
          of the server in the search bar.
          <br />
          We currently support the following formats: <br /> <br />-
          cfx.re/join/ID <br />
          - ID <br />
          - cfx.re/ID <br />
        </p>
      </div>
      <div>
        <Tag>Need Support?</Tag>
        <Link
          href="https://discord.gg/S8Z77aS"
          className="text-blue-500 font-bold"
          rel="noopener noreferrer"
        >
          Discord
        </Link>
      </div>
    </div>
  );
}
