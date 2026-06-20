export type RideProvider = 'chalo' | 'uber' | 'ola' | 'rapido' | 'namma_yatri';
export type FoodProvider = 'zomato' | 'swiggy' | 'eatsure' | 'chalo';
export type MartProvider = 'zepto' | 'blinkit' | 'instamart' | 'chalo';
export type StayProvider = 'makemytrip' | 'agoda' | 'oyo' | 'airbnb' | 'bookingcom' | 'goibibo' | 'cleartrip' | 'chalo';
export type TravelProvider = 'irctc' | 'makemytrip' | 'cleartrip' | 'ixigo' | 'skyscanner' | 'kayak' | 'chalo';
export type IntercityProvider = 'redbus' | 'makemytrip' | 'chalo' | 'ola' | 'uber';

export type AnyProvider = RideProvider | FoodProvider | MartProvider | StayProvider | TravelProvider | IntercityProvider;

export interface VehicleOption {
  id: string;
  provider: RideProvider;
  name: string;
  description: string;
  price: number;
  eta: number; // in minutes
  iconType: 'auto' | 'bike' | 'car' | 'suv' | 'truck';
  capacity: number;
  isPromo?: boolean;
}

export interface IntercityVehicleOption {
  id: string;
  provider: IntercityProvider;
  name: string;
  type: 'Hatchback' | 'Sedan' | 'SUV' | 'Tempo Traveller' | 'Bus';
  description: string;
  price: number;
  capacity: number;
  features: string[];
  imageUrl: string;
}

export interface Location {
  name: string;
  address: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  customName?: string;
  flatNo: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  isPreferred: boolean;
  lat: number;
  lng: number;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface ActivityItem {
  id: string;
  provider: AnyProvider;
  type: 'ride' | 'food' | 'mart' | 'stays' | 'intercity' | 'flights';
  title: string;
  date: string;
  status: 'completed' | 'cancelled' | 'ongoing';
  price: number;
}

export interface Restaurant {
  id: string;
  provider: FoodProvider;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  imageUrl: string;
  offer?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isVeg: boolean;
}

export interface MartCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface MartItem {
  id: string;
  provider: MartProvider;
  name: string;
  weight: string;
  price: number;
  eta: string;
  imageUrl: string;
}

export type StayType = 'hotel' | 'hostel' | 'apartment' | 'villa' | 'resort';

export interface Stay {
  id: string;
  provider: StayProvider;
  type: StayType;
  name: string;
  location: string;
  rating: number;
  price: number;
  originalPrice: number;
  imageUrl: string;
  amenities: string[];
}

export interface RewardTransaction {
  id: string;
  description: string;
  points: number;
  type: 'earned' | 'spent';
  date: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  provider: AnyProvider;
  type: 'food' | 'mart';
}

export type PaymentMethodType = 'upi' | 'card' | 'wallet' | 'cash';

export interface SavedMethod {
  id: string;
  type: PaymentMethodType;
  title: string;
  subtitle: string;
  iconUrl?: string;
  fallbackIcon?: React.ReactNode;
  sessionOnly?: boolean;
}

export interface WalletItem {
  id: string;
  title: string;
  balance: number;
  isLinked: boolean;
  iconUrl: string;
  domain: string;
}

export type ViewState = 'home' | 'activity' | 'account' | 'booking' | 'food' | 'mart' | 'stays' | 'flights' | 'intercity' | 'insurance' | 'gifts' | 'pay_bills' | 'more' | 'linked_accounts' | 'payment_methods' | 'address_management';
export type BookingStep = 'search' | 'select_vehicle' | 'confirming' | 'on_way';
