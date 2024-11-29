import { Column } from "@/src/components/Column";
import { Divider } from "@/src/components/Divider";
import { Error } from "@/src/components/Error";
import { ImageWithFallback } from "@/src/components/ImageWithFallback";
import { Container } from "@/src/components/layout/Container";
import { PlayerSection } from "@/src/components/sections/PlayerSection";
import { ResourceSection } from "@/src/components/sections/ResourceSection";
import { formatToHTMLColor } from "@/src/functions/formatToHTMLColor";
import { getFlagEmoji } from "@/src/functions/getFlagEmoji";
import { getUpvoteTooltip } from "@/src/functions/getUpvoteTooltip";
import { isDefined } from "@/src/functions/isDefined";
import { ServerData } from "@/src/types/ServerData";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface LookupPageProps {
  searchParams: Promise<{ query?: string }>;
}

export async function generateMetadata({
  searchParams,
}: LookupPageProps): Promise<Metadata> {
  const query = (await searchParams).query;

  if (!query) {
    return {
      title: `Error | FiveM Server Lookup`,
    };
  }

  const data = await fetchDataFromAPI(query);

  if (!data) {
    return {
      title: `Unknown | FiveM Server Lookup`,
    };
  }

  return {
    title: `${data.hostname} | FiveM Server Lookup`,
  };
}

/**
 *
 * @param query cfx server id of the server
 * @returns returns data object of server relevant details
 */
async function fetchDataFromAPI(query: string) {
  const request = await fetch(
    `https://servers-frontend.fivem.net/api/servers/single/${query}`
  );

  const { Data: data }: { Data: ServerData } = await request.json();
  return data;
}

const Page = async ({ searchParams }: LookupPageProps) => {
  const query = (await searchParams).query;

  if (!query) {
    return <Error message="Please provide an FiveM Server Id!" />;
  }

  const data = await fetchDataFromAPI(query);

  if (!data) {
    notFound();
  }

  if (data.vars.lookup !== undefined && data.vars.lookup) {
    return <Error message="Lookups for this server are disabled." />;
  }

  return (
    <>
      <Container>
        {data.vars && data.vars.banner_detail && (
          <ImageWithFallback
            src={`/api/image-proxy?url=${encodeURIComponent(
              data.vars.banner_detail
            )}`}
            fallbackSrc="/no-banner.svg"
            alt="Banner"
            className="rounded-t-md max-h-full aspect-auto"
            sizes="100vw"
            width={1920}
            height={1080}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        )}
        <div className="flex flex-col gap-4 px-8 py-4 rounded-b-md">
          <div className="flex flex-col gap-2">
            {data.vars.sv_projectName && (
              <>
                <p className="text-sm">
                  {formatToHTMLColor(data.vars.sv_projectName)}
                </p>
                <Divider />
              </>
            )}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4">
              {data.iconVersion && (
                <ImageWithFallback
                  src={`https://servers-frontend.fivem.net/api/servers/icon/${query}/${data.iconVersion}.png`}
                  className="rounded-md"
                  alt="Server Icon"
                  width={1920}
                  height={1080}
                  fallbackSrc="/no-icon.svg"
                  style={{
                    width: 128,
                    height: 128,
                  }}
                />
              )}
              <p className="overflow-hidden text-xl">
                <span className="select-none">
                  {data.vars.locale && getFlagEmoji(data.vars.locale) + " "}
                </span>
                {formatToHTMLColor(data.hostname)}
              </p>
              <span className="text-nowrap">
                {data.clients} / {data.svMaxclients}
              </span>
            </div>
          </div>
          <div className="flex flex-row justify-between gap-2">
            <Column
              name="Upvotes"
              value={data.upvotePower}
              tooltip={getUpvoteTooltip(data.upvotePower, 5.95)}
            />
            <Column name="Bursts" value={data.burstPower} />

            {isDefined(data.vars["txAdmin-version"]) && (
              <Column
                name="txAdmin Version"
                value={String(data.vars["txAdmin-version"])}
              />
            )}
            {isDefined(data.vars.sv_enforceGameBuild) && (
              <Column name="Game Build" value={data.vars.sv_enforceGameBuild} />
            )}
          </div>
        </div>
      </Container>
      {data.players && data.players.length > 0 && (
        <PlayerSection players={data.players} />
      )}
      {data.resources && data.resources.length > 0 && (
        <ResourceSection resources={data.resources} />
      )}
    </>
  );
};

export default Page;
