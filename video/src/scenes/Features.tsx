import React from "react";
import { Card, Callout, Heading, Scene, Screen } from "../ui";
import { Sequence } from "remotion";

/* Callout x/y are in video pixels; the window spans x 160 to 1760 from y 300 */

export const Dashboard: React.FC = () => (
  <Scene>
    <Heading kicker="Live dashboard" title="Every room, live." />
    <Screen src="dash.jpg" focus={[40, 45]} zoom={1.1} />
    <Callout text="66 rooms to clean" x={470} y={560} from={70} />
    <Callout text="70 ready to sell" x={790} y={860} from={130} />
    <Callout text="24 arrivals today" x={1230} y={700} from={180} />
  </Scene>
);

export const Housekeeping: React.FC = () => (
  <Scene>
    <Heading kicker="Housekeeping" title="From checkout to clean, instantly." />
    <Sequence durationInFrames={175} layout="none">
      <Screen src="rooms.jpg" focus={[50, 55]} zoom={1.08} />
      <Callout text="Room turns dirty at checkout" x={700} y={760} from={40} />
    </Sequence>
    <Sequence from={160} layout="none">
      <Screen src="housekeeping.jpg" focus={[55, 70]} zoom={1.08} from={0} rise={false} />
      <Callout text="Assigned in one tap" x={1090} y={760} from={30} />
      <Callout text="Approved from the phone" x={420} y={900} from={100} />
    </Sequence>
  </Scene>
);

export const Requests: React.FC = () => (
  <Scene>
    <Heading kicker="Guest requests" title="Every call becomes a task." />
    <Sequence durationInFrames={120} layout="none">
      <Screen src="requests.png" focus={[50, 70]} zoom={1.08} />
      <Callout text="Tracked until delivered" x={1040} y={820} from={40} />
    </Sequence>
    <Sequence from={108} layout="none">
      <Screen src="chat.jpg" focus={[75, 70]} zoom={1.1} from={0} rise={false} />
      <Callout text="Replies in English or Spanish" x={830} y={900} from={24} />
    </Sequence>
  </Scene>
);

export const Maintenance: React.FC = () => (
  <Scene>
    <Heading kicker="Maintenance and lost & found" title="Tracked to done." />
    <Screen src="engineering.jpg" focus={[45, 55]} zoom={1.06} dim={0} />
    <Callout text="Repair orders with a due time" x={1050} y={600} from={30} />
    <Card src="lost.png" width={1300} left={310} top={760} from={90} />
  </Scene>
);

export const Room: React.FC = () => (
  <Scene>
    <Heading kicker="Room details" title="Tap a room. See everything." />
    <Screen src="rooms.jpg" focus={[30, 40]} zoom={1.04} dim={0.45} />
    <Card src="room.png" width={560} left={1180} top={250} from={24} />
    <Callout text="Guest, folio and checkout" x={480} y={620} from={60} />
  </Scene>
);

export const Alcohol: React.FC = () => (
  <Scene>
    <Heading kicker="Florida alcohol law" title="ID checked on every sale." />
    <Screen src="cash.jpg" focus={[50, 50]} zoom={1.03} dim={0.45} />
    <Card src="alcohol.png" width={820} left={940} top={300} from={20} />
    <Callout text="Under 21? The sale stops." x={300} y={640} from={70} />
  </Scene>
);

export const Install: React.FC = () => (
  <Scene>
    <Heading kicker="Nothing to download" title="Scan, sign in, start." />
    <Card src="qr.png" width={760} left={1000} top={250} from={16} />
    <Callout text="No app store" x={300} y={560} from={40} />
    <Callout text="Each person signs in with a PIN" x={300} y={680} from={90} />
  </Scene>
);
