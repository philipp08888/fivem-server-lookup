import { Container } from "@/src/components/layout/Container";
import { Tag } from "@/src/components/Tag";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <Container className="gap-2 px-8 py-4">
        <div className="flex flex-col gap-2">
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
            className="font-bold text-blue-500"
            rel="noopener noreferrer"
          >
            Discord
          </Link>
        </div>
      </Container>
      <Container className="px-8 py-4">
        <Tag>info for server admins</Tag>
        <p>
          You don&lsquo;t want your server to be accessible here via a lookup?
          Then you have to set a convar in the server.cfg: <br />
          <code className="bg-black">set lookup false</code>
        </p>
      </Container>
    </>
  );
}
