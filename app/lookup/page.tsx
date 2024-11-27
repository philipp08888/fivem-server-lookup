import { Divider } from "@/src/components/Divider";
import { Error } from "@/src/components/Error";
import { ImageWithFallback } from "@/src/components/ImageWithFallback";
import { InformativeTooltip } from "@/src/components/InformativeTooltip";
import { Container } from "@/src/components/layout/Container";
import { PlayerSection } from "@/src/components/sections/PlayerSection";
import { ResourceSection } from "@/src/components/sections/ResourceSection";
import { Tag } from "@/src/components/Tag";
import { ServerData } from "@/src/types/ServerData";
import { formatToHTMLColor } from "@/src/utils/formatToHTMLColor";
import { getFlagEmoji } from "@/src/utils/getFlagEmoji";
import { Metadata } from "next";
import Link from "next/link";
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
            priority
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
                  priority
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
          <div>
            <Tag>Information</Tag>
            <div className="flex flex-row justify-between flex-wrap">
              {data.upvotePower > 0 && (
                <div className="flex flex-row gap-1 items-center">
                  <p>🚀 {data.upvotePower} Upvotes</p>
                  <InformativeTooltip>
                    An upvote costs 5.95 euros (
                    <a
                      href="https://zap-hosting.com/en/shop/product/fivem-upvotes/"
                      rel="noopener noreferrer"
                    >
                      zap-hosting.com
                    </a>
                    ) <br />
                    {data.upvotePower} Upvotes x 5,95€ ={" "}
                    {Math.round(data.upvotePower * 5.6)} €
                  </InformativeTooltip>
                </div>
              )}
              {data.vars?.sv_enforceGameBuild && (
                <div className="flex flex-row gap-1 items-center">
                  <p>🎮 Game Build {data.vars.sv_enforceGameBuild}</p>
                  <InformativeTooltip>
                    The sv_enforceGameBuild setting sets the game version for
                    the server and thus makes it possible to access new DLC
                    content such as cars, weapons or interiors.
                    <br />
                    You can find a list of the game versions currently supported
                    by FiveM here:{" "}
                    <Link href="https://zap-hosting.com/guides/docs/fivem-gamebuild/#available-gamebuilds">
                      Game Builds
                    </Link>
                  </InformativeTooltip>
                </div>
              )}
              {data.server && (
                <div className="flex flex-row gap-1 items-center">
                  <p>{data.server}</p>
                  <InformativeTooltip>
                    The server data point usually tells you which operating
                    system the respective server is running on
                  </InformativeTooltip>
                </div>
              )}
            </div>
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
