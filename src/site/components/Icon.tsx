import {
  Phone, PhoneCall, PhoneForwarded, PhoneIncoming, PhoneOutgoing, PhoneMissed, MessageSquare, MessagesSquare,
  Inbox, Voicemail, Mic, Headphones, Users, User, Building2, Globe, MapPin, Hash, Clock, Calendar, ShieldCheck,
  Lock, Zap, Bot, Sparkles, Wallet, CreditCard, DollarSign, BarChart3, List, Settings, Route, GitBranch, Bell,
  Smartphone, Laptop, Monitor, Plug, Code2, Webhook, Check, Star, Heart, Briefcase, Home, Wrench, Truck,
  Stethoscope, Scale, GraduationCap, Store, Rocket, FileText, Search, RefreshCw, Music, Pause, Volume2, Moon, Tag,
  Repeat, Send, Circle, type LucideIcon,
} from "lucide-react";
import type { IconName } from "../content/types";

const MAP: Record<IconName, LucideIcon> = {
  phone: Phone, "phone-call": PhoneCall, "phone-forwarded": PhoneForwarded, "phone-incoming": PhoneIncoming,
  "phone-outgoing": PhoneOutgoing, "phone-missed": PhoneMissed, message: MessageSquare, messages: MessagesSquare,
  inbox: Inbox, voicemail: Voicemail, mic: Mic, headphones: Headphones, users: Users, user: User, building: Building2,
  globe: Globe, "map-pin": MapPin, hash: Hash, clock: Clock, calendar: Calendar, shield: ShieldCheck, lock: Lock,
  zap: Zap, bot: Bot, sparkles: Sparkles, wallet: Wallet, "credit-card": CreditCard, dollar: DollarSign,
  chart: BarChart3, list: List, settings: Settings, route: Route, "git-branch": GitBranch, bell: Bell,
  smartphone: Smartphone, laptop: Laptop, monitor: Monitor, plug: Plug, code: Code2, webhook: Webhook, check: Check,
  star: Star, heart: Heart, briefcase: Briefcase, home: Home, wrench: Wrench, truck: Truck, stethoscope: Stethoscope,
  scale: Scale, graduation: GraduationCap, store: Store, rocket: Rocket, file: FileText, search: Search,
  refresh: RefreshCw, music: Music, pause: Pause, volume: Volume2, moon: Moon, tag: Tag, repeat: Repeat, send: Send,
};

export function Icon({ name, size = 20 }: { name?: IconName | string; size?: number }) {
  const C = (name && MAP[name as IconName]) || Circle;
  return <C size={size} strokeWidth={1.9} />;
}
