import { useState, type ReactNode } from 'react';
import { FlatList, View } from 'react-native';

import {
  AppBar,
  AppText,
  AttachGrid,
  Avatar,
  Banner,
  Bubble,
  Button,
  BuzzCard,
  BuzzProgress,
  CallButton,
  CallItem,
  CellStrip,
  ChatHeader,
  ChatItem,
  Check,
  Chip,
  Chips,
  Composer,
  ContactRow,
  DateChip,
  EmptyState,
  Fab,
  IconButton,
  Keypad,
  Logo,
  MessageMenu,
  OTPInput,
  ProfileHeader,
  QuickActions,
  Radio,
  ReactionBar,
  Screen,
  SearchBar,
  SectionTitle,
  SettingsGroup,
  SettingsRow,
  Sheet,
  SystemNote,
  TabBar,
  TAB_BAR_SPACE,
  TextField,
  Toggle,
  Typing,
  Wallpaper,
  type TabKey,
} from '../components';
import { people as P } from '../data/sample';
import { colors, senderColors } from '../theme';
import { makeStyles, useResponsive } from '../utils/responsive';

interface Section {
  key: string;
  title: string;
  flows: string;
  render: () => ReactNode;
}

const useStyles = makeStyles(({ ms }) => ({
  section: { paddingBottom: ms(12), borderBottomWidth: 1, borderBottomColor: colors.line },
  flows: { paddingHorizontal: ms(16), marginTop: -ms(2), marginBottom: ms(6) },
  pad: { paddingHorizontal: ms(16), gap: ms(10) },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: ms(12), paddingHorizontal: ms(16) },
  wall: { paddingHorizontal: ms(12), paddingVertical: ms(10), overflow: 'hidden' },
  overlay: { paddingHorizontal: ms(14), gap: ms(10), alignItems: 'flex-start' },
}));

/**
 * Dev screen: every component rendered with design-file sample data, grouped by the
 * flows that use it. Temporary home screen until the real flows are wired up.
 */
export default function ComponentGallery() {
  const styles = useStyles();
  const { vs } = useResponsive();
  const [tab, setTab] = useState<TabKey>('chats');
  const [chip, setChip] = useState<number>(0);
  const [toggle, setToggle] = useState<boolean>(true);
  const [check, setCheck] = useState<boolean>(true);
  const [phone, setPhone] = useState<string>('981 234 5678');
  const [otp, setOtp] = useState<string>('482');
  const [search, setSearch] = useState<string>('');
  const [draft, setDraft] = useState<string>('');
  const [sheet, setSheet] = useState<boolean>(false);
  const [reaction, setReaction] = useState<string>('❤️');
  const noop = (): void => undefined;

  const sections: Section[] = [
    {
      key: 'brand',
      title: 'Brand & avatars',
      flows: 'All flows',
      render: () => (
        <View style={styles.row}>
          <Logo size={48} />
          <Avatar person={P.aarav} size={56} online />
          <Avatar person={P.priya} size={56} ring="new" />
          <Avatar person={P.mom} size={56} ring="seen" />
          <Avatar person={{ initials: '', color: 4 }} size={56} icon="users" />
        </View>
      ),
    },
    {
      key: 'onb',
      title: 'Onboarding & Sign-in',
      flows: 'Flow 1 · TextField · OTPInput · Keypad · Button · Toggle',
      render: () => (
        <View style={{ gap: vs(12) }}>
          <View style={styles.pad}>
            <TextField label="Mobile number" prefix="🇳🇵 +977" value={phone} onChange={setPhone} keyboardType="phone-pad" />
            <TextField label="Name" value="" placeholder="Your name" icon="user" onChange={noop} />
            <OTPInput value={otp} onChange={setOtp} autoFocus={false} />
            <Button label="Get started" onPress={noop} />
            <Button label="Invite friends" variant="ghost" icon="link" onPress={noop} />
            <Button label="Block contact" variant="danger" onPress={noop} />
            <Button label="Skip for now" variant="text" onPress={noop} />
          </View>
          <Keypad onKey={(k) => setPhone((p) => (k === 'back' ? p.slice(0, -1) : p + k))} />
        </View>
      ),
    },
    {
      key: 'chat',
      title: 'Chats',
      flows: 'Flow 2 · AppBar · SearchBar · Chips · CellStrip · ChatItem · Fab',
      render: () => (
        <View>
          <AppBar title="Chats" actions={[{ icon: 'camera', label: 'Camera' }, { icon: 'more', label: 'More' }]} />
          <View style={styles.pad}>
            <SearchBar value={search} onChange={setSearch} />
          </View>
          <Chips
            items={[{ label: 'All' }, { label: 'Unread', count: 4 }, { label: 'Groups' }, { label: 'Favourites' }, { label: 'Work' }]}
            active={chip}
            onChange={setChip}
          />
          <CellStrip
            items={[
              { key: 'p', person: P.priya, label: 'Priya', ring: 'new' },
              { key: 'a', person: P.aarav, label: 'Aarav', online: true },
              { key: 'm', person: P.mom, label: 'Mom', ring: 'seen' },
              { key: 'd', person: P.design, label: 'Design' },
              { key: 's', person: P.sita, label: 'Sita', online: true },
            ]}
            onPress={noop}
          />
          <ChatItem person={P.priya} typing time="now" unread={2} pinned onPress={noop} />
          <ChatItem person={P.design} sender="Kiran" message="Pushed the new hex icons 🔥" time="9:32" unread={12} onPress={noop} />
          <ChatItem person={P.aarav} message="See you at 7 then!" time="9:05" tick="read" onPress={noop} />
          <ChatItem person={P.devhive} sender="Nabin" message="Deploy done ✅" time="Yesterday" muted unread={36} onPress={noop} />
          <ChatItem person={P.rohan} message="📷 Photo" time="Yesterday" tick="delivered" onPress={noop} />
          <View style={styles.row}>
            <Fab icon="chatplus" label="New chat" inline onPress={noop} />
            <Fab icon="camera" label="New Buzz" inline onPress={noop} />
          </View>
        </View>
      ),
    },
    {
      key: 'msg',
      title: 'Messaging interactions',
      flows: 'Flows 2–4 · ChatHeader · Bubble · DateChip · SystemNote · Typing · Composer',
      render: () => (
        <View>
          <ChatHeader person={P.priya} status="online" onBack={noop} onCall={noop} onVideo={noop} onInfo={noop} />
          <View style={styles.wall}>
            <Wallpaper base />
            <SystemNote text="Messages are end-to-end encrypted. No one outside this chat can read them." />
            <DateChip label="Today" />
            <Bubble dir="in" text="Heyy! Did you finish the Hive mockups? 👀" time="9:12" />
            <Bubble dir="out" text="Almost! Sending a preview now" time="9:13" tick="read" />
            <Bubble dir="out" image={{ tint: 'accent' }} text="New dark theme ✨" time="9:13" tick="read" grouped reactions="❤️ 🔥" />
            <Bubble dir="in" quote={{ who: 'You', text: 'New dark theme ✨' }} text="Obsessed with the hexagon avatars 😍" time="9:15" />
            <Bubble dir="in" voice={{ progress: 0.35, duration: '0:18' }} time="9:16" grouped />
            <Bubble dir="out" link={{ title: 'Figma — Hive Chat UI', domain: 'figma.com' }} text="Full file here" time="9:20" tick="delivered" />
            <Typing />
          </View>
          <Composer value={draft} onChange={setDraft} onSend={() => setDraft('')} onAttach={() => setSheet(true)} />
          <Composer
            value="Yes! Same components 💯"
            onChange={noop}
            onSend={noop}
            replyTo={{ who: 'Priya Thapa', text: 'Can we use this for the web version too?' }}
          />
          <Composer state="recording" value="" onChange={noop} onSend={noop} recordingTime="0:07" />
          <View style={[styles.overlay, { marginTop: vs(8) }]}>
            <ReactionBar active={reaction} onPick={setReaction} onMore={noop} />
            <MessageMenu
              items={[
                { key: 'reply', label: 'Reply', icon: 'reply' },
                { key: 'forward', label: 'Forward', icon: 'forward' },
                { key: 'copy', label: 'Copy', icon: 'copy' },
                { key: 'delete', label: 'Delete', icon: 'trash', danger: true },
              ]}
              onPick={noop}
            />
            <Button label="Open attachment sheet" variant="ghost" icon="clip" onPress={() => setSheet(true)} />
          </View>
          <Sheet title="Share" open={sheet} onClose={() => setSheet(false)}>
            <AttachGrid onPick={() => setSheet(false)} />
          </Sheet>
        </View>
      ),
    },
    {
      key: 'grp',
      title: 'Groups',
      flows: 'Flow 4 · ContactRow · CellStrip (remove) · Bubble (sender, doc, poll)',
      render: () => (
        <View>
          <CellStrip
            size={50}
            items={[
              { key: 'p', person: P.priya, label: 'Priya' },
              { key: 'k', person: P.kiran, label: 'Kiran' },
              { key: 's', person: P.sita, label: 'Sita' },
            ]}
            onRemove={noop}
          />
          <ContactRow person={P.sita} checked={check} onPress={() => setCheck((c) => !c)} />
          <ContactRow person={P.kiran} checked={false} onPress={noop} />
          <ContactRow person={P.me} sub="You" right={<Chip label="Admin" size="sm" active />} />
          <View style={styles.wall}>
            <Wallpaper base />
            <Bubble dir="in" sender="Kiran Adhikari" senderColor={senderColors[0]} text="Pushed the new hex icons 🔥" time="9:32" />
            <Bubble dir="in" sender="Sita Gurung" senderColor={senderColors[1]} doc={{ ext: 'PDF', name: 'Hive_Brand_v2.pdf', size: '2.4 MB · 12 pages' }} time="9:34" />
            <Bubble dir="in" sender="Priya Thapa" senderColor={senderColors[2]} text="@Binit which accent do we ship?" time="9:35" reactions="👍 2" />
            <Bubble
              dir="out"
              poll={{
                question: 'Which accent should we ship?',
                hint: 'Select one',
                options: [
                  { label: 'Ocean', votes: 3, selected: true },
                  { label: 'Violet', votes: 1 },
                  { label: 'Coral', votes: 0 },
                ],
              }}
              time="9:36"
              tick="read"
            />
          </View>
        </View>
      ),
    },
    {
      key: 'buzz',
      title: 'Buzz (Status)',
      flows: 'Flow 5 · BuzzCard · BuzzProgress',
      render: () => (
        <View style={{ gap: vs(12) }}>
          <View style={styles.row}>
            <BuzzCard variant="add" person={P.me} label="Add Buzz" onPress={noop} />
            <BuzzCard person={P.priya} background="coral" label="Priya" onPress={noop} />
            <BuzzCard person={P.kiran} background="blue" label="Kiran" onPress={noop} />
          </View>
          <BuzzProgress count={3} current={1} progress={0.55} />
        </View>
      ),
    },
    {
      key: 'call',
      title: 'Calls',
      flows: 'Flow 6 · CallItem · CallButton',
      render: () => (
        <View style={{ gap: vs(12) }}>
          <View>
            <CallItem person={P.mom} direction="in" missed time="Today, 8:40" count={2} onCall={noop} />
            <CallItem person={P.priya} direction="out" time="Today, 8:02 · 12:40" video onCall={noop} />
            <CallItem person={P.aarav} direction="out" time="Yesterday, 14:11 · 3:05" onCall={noop} />
          </View>
          <View style={styles.row}>
            <CallButton icon="speaker" variant="on" a11yLabel="Speaker" />
            <CallButton icon="video" a11yLabel="Video" />
            <CallButton icon="micoff" a11yLabel="Mute" />
            <CallButton icon="phone" variant="end" a11yLabel="End call" />
          </View>
          <View style={styles.row}>
            <CallButton icon="close" variant="end" big label="Decline" />
            <CallButton icon="chat" size={48} label="Message" />
            <CallButton icon="phone" variant="ok" big label="Accept" />
          </View>
        </View>
      ),
    },
    {
      key: 'hive',
      title: 'Hives (Communities)',
      flows: 'Flow 7 · Banner · ProfileHeader · SectionTitle',
      render: () => (
        <View>
          <Banner title="Create a Hive" text="Bring your groups together — school, building, team." leading={<Logo size={38} />} right={<IconButton icon="plus" label="Create a Hive" color="accent2" />} />
          <Banner text="Your contacts are hashed on-device and never stored in plain text." icon="shield" />
          <Banner variant="warn" text="Connecting… messages will send when back online." icon="refresh" />
          <ProfileHeader person={{ ...P.design, initials: 'HT', name: 'Hive Team 🐝' }} sub="Hive · 3 groups · 38 members" size={88} />
          <SectionTitle title="Groups in this Hive" action={{ label: 'See all', onPress: noop }} />
          <EmptyState icon="phone" title="No calls yet" text="Tap the call button in any chat to start one." />
        </View>
      ),
    },
    {
      key: 'set',
      title: 'Settings & Profile',
      flows: 'Flow 8 · SettingsGroup · SettingsRow · QuickActions · Toggle · Radio · Check',
      render: () => (
        <View>
          <ProfileHeader person={P.priya} sub="+977 984-555-0192 · online" size={80} />
          <QuickActions
            items={[
              { icon: 'phone', label: 'Audio' },
              { icon: 'video', label: 'Video' },
              { icon: 'search', label: 'Search' },
              { icon: 'belloff', label: 'Mute' },
            ]}
          />
          <SettingsGroup>
            <SettingsRow icon="lock" color="green" title="Privacy" sub="Last seen, blocked, app lock" onPress={noop} />
            <SettingsRow icon="dcheck" color="sky" title="Read receipts" sub="Turn off to hide blue ticks both ways" right={<Toggle on={toggle} onChange={setToggle} label="Read receipts" />} />
            <SettingsRow icon="storage" color="blue" title="Storage and data" value="1.2 GB" onPress={noop} />
          </SettingsGroup>
          <SettingsGroup>
            <SettingsRow icon="close" title="Block Priya" danger right="none" onPress={noop} />
          </SettingsGroup>
          <View style={styles.row}>
            <Toggle on={toggle} onChange={setToggle} label="Toggle" />
            <Radio on={toggle} onChange={() => setToggle(true)} label="Radio on" />
            <Radio on={!toggle} onChange={() => setToggle(false)} label="Radio off" />
            <Check on={check} onChange={setCheck} label="Check" />
            <Chip label="Say hi 👋" active onPress={noop} />
            <Chip label="My contacts" icon="users" trailingIcon="down" onPress={noop} />
          </View>
        </View>
      ),
    },
  ];

  return (
    <Screen edges={['top', 'left', 'right']}>
      <FlatList<Section>
        data={sections}
        keyExtractor={(s) => s.key}
        contentContainerStyle={{ paddingBottom: vs(TAB_BAR_SPACE) }}
        ListHeaderComponent={<AppBar title="Components" sub="Hive Chat UI kit · mobile" />}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <SectionTitle title={item.title} />
            <AppText variant="caption" weight="medium" color="muted" style={styles.flows}>
              {item.flows}
            </AppText>
            {item.render()}
          </View>
        )}
      />
      <TabBar active={tab} onChange={setTab} newBuzz />
    </Screen>
  );
}
