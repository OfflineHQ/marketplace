import { HoverCardContent } from '@ui/components';

const DiscordWidget = ({ handle }: { handle: string }) => {
  const discordUrl = `https://discord.com/widget?id=${handle}&theme=dark`;

  return (
    <HoverCardContent
      side="bottom"
      className="m-0 h-72 w-80 p-0 md:h-80 md:w-72"
    >
      <iframe
        title="discord-widget"
        src={discordUrl}
        allowTransparency
        frameBorder="0"
        loading="lazy"
        className="h-full w-full rounded-md border"
        data-testid="iframe"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      ></iframe>
    </HoverCardContent>
  );
};

export default DiscordWidget;
