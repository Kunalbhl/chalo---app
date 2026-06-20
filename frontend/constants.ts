import { VehicleOption, ActivityItem, Location, Restaurant, MartCategory, MartItem, Stay } from './types';

export const RECENT_LOCATIONS: Location[] = [
  { name: 'Home', address: '123, Palm Grove Apartments, Indiranagar' },
  { name: 'Work', address: 'Tech Park, Outer Ring Road, Bellandur' },
  { name: 'Phoenix Marketcity', address: 'Whitefield Main Road, Mahadevapura' },
];

export const VEHICLES: VehicleOption[] = [
  { id: 'r2', provider: 'rapido', name: 'Rapido Auto', description: 'Lowest price auto', price: 80, eta: 5, iconType: 'auto', capacity: 3 },
  { id: 'n1', provider: 'namma_yatri', name: 'NY Auto', description: 'Direct to driver', price: 82, eta: 3, iconType: 'auto', capacity: 3 },
  { id: 'v1', provider: 'chalo', name: 'Chalo Auto', description: 'Quick, affordable', price: 85, eta: 3, iconType: 'auto', capacity: 3, isPromo: true },
  { id: 'o1', provider: 'ola', name: 'Ola Auto', description: 'Everyday auto', price: 88, eta: 4, iconType: 'auto', capacity: 3 },
  { id: 'u1', provider: 'uber', name: 'Uber Auto', description: 'Standard auto', price: 92, eta: 2, iconType: 'auto', capacity: 3 },
  
  { id: 'r1', provider: 'rapido', name: 'Rapido Bike', description: 'Beat the traffic', price: 45, eta: 1, iconType: 'bike', capacity: 1 },
  { id: 'v2', provider: 'chalo', name: 'Chalo Moto', description: 'Quick rides', price: 48, eta: 2, iconType: 'bike', capacity: 1 },
  { id: 'u3', provider: 'uber', name: 'Uber Moto', description: 'Affordable bike', price: 52, eta: 3, iconType: 'bike', capacity: 1 },

  { id: 'v3', provider: 'chalo', name: 'Chalo Mini', description: 'Comfy hatchbacks', price: 160, eta: 5, iconType: 'car', capacity: 4 },
  { id: 'o2', provider: 'ola', name: 'Ola Mini', description: 'Everyday city rides', price: 165, eta: 6, iconType: 'car', capacity: 4 },
  { id: 'u2', provider: 'uber', name: 'Uber Go', description: 'Affordable compact rides', price: 175, eta: 4, iconType: 'car', capacity: 4 },

  { id: 'v4', provider: 'chalo', name: 'Chalo Sedan', description: 'Spacious rides', price: 210, eta: 7, iconType: 'car', capacity: 4 },
  { id: 'o3', provider: 'ola', name: 'Ola Prime', description: 'Top rated sedans', price: 230, eta: 5, iconType: 'car', capacity: 4 },
  { id: 'u4', provider: 'uber', name: 'Uber Premier', description: 'Comfortable sedans', price: 245, eta: 6, iconType: 'car', capacity: 4 },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 'a1', provider: 'uber', type: 'ride', title: 'Uber Go to Tech Park', date: 'Today, 09:30 AM', status: 'completed', price: 185 },
  { id: 'a2', provider: 'zomato', type: 'food', title: 'Biryani Paradise', date: 'Yesterday, 08:15 PM', status: 'completed', price: 450 },
  { id: 'a3', provider: 'airbnb', type: 'stays', title: 'Luxury Pool Villa', date: '12 Oct - 15 Oct', status: 'completed', price: 45000 },
  { id: 'a4', provider: 'chalo', type: 'ride', title: 'Chalo Auto to Indiranagar', date: '10 Oct, 06:00 PM', status: 'cancelled', price: 0 },
];

export const HISTORICAL_ACTIVITY: ActivityItem[] = [
  { id: 'h1', provider: 'swiggy', type: 'food', title: 'Truffles Burger', date: '05 Oct, 01:30 PM', status: 'completed', price: 320 },
  { id: 'h2', provider: 'ola', type: 'ride', title: 'Ola Mini to Airport', date: '01 Oct, 04:00 AM', status: 'completed', price: 850 },
  { id: 'h3', provider: 'zepto', type: 'mart', title: 'Weekly Groceries', date: '28 Sep, 10:00 AM', status: 'completed', price: 1240 },
  { id: 'h4', provider: 'makemytrip', type: 'stays', title: 'Taj Mahal Palace', date: '15 Sep - 18 Sep', status: 'completed', price: 37500 },
];

export const RESTAURANTS: Restaurant[] = [
  { id: 'r1', provider: 'zomato', name: 'Meghana Foods', cuisine: 'Biryani, Andhra', rating: 4.5, deliveryTime: '30 min', deliveryFee: 40, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', offer: '60% OFF up to ₹120' },
  { id: 'r2', provider: 'swiggy', name: 'Meghana Foods', cuisine: 'Biryani, Andhra', rating: 4.4, deliveryTime: '35 min', deliveryFee: 25, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
  { id: 'r3', provider: 'swiggy', name: 'Truffles', cuisine: 'Burgers, Continental', rating: 4.6, deliveryTime: '25 min', deliveryFee: 30, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { id: 'r4', provider: 'zomato', name: 'Truffles', cuisine: 'Burgers, Continental', rating: 4.7, deliveryTime: '40 min', deliveryFee: 0, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', offer: 'Free Delivery' },
  { id: 'r5', provider: 'chalo', name: 'Empire Restaurant', cuisine: 'North Indian, Fast Food', rating: 4.3, deliveryTime: '45 min', deliveryFee: 15, imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80', offer: 'Chalo Exclusive: 20% OFF' },
];

export const MART_CATEGORIES: MartCategory[] = [
  { id: 'm1', name: 'Fresh Veggies', icon: 'Carrot', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'm2', name: 'Fruits', icon: 'Apple', color: 'bg-rose-100 text-rose-600' },
  { id: 'm3', name: 'Dairy & Bread', icon: 'Milk', color: 'bg-blue-100 text-blue-600' },
  { id: 'm4', name: 'Snacks', icon: 'Cookie', color: 'bg-amber-100 text-amber-600' },
  { id: 'm5', name: 'Meat', icon: 'Drumstick', color: 'bg-red-100 text-red-600' },
  { id: 'm6', name: 'Pharmacy', icon: 'Pill', color: 'bg-teal-100 text-teal-600' },
];

export const MART_ITEMS: MartItem[] = [
  { id: 'mi1', provider: 'zepto', name: 'Farm Fresh Onion', weight: '1 kg', price: 45, eta: '10 min', imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=200&q=80' },
  { id: 'mi2', provider: 'blinkit', name: 'Farm Fresh Onion', weight: '1 kg', price: 42, eta: '14 min', imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=200&q=80' },
  { id: 'mi3', provider: 'instamart', name: 'Farm Fresh Onion', weight: '1 kg', price: 48, eta: '12 min', imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=200&q=80' },
  { id: 'mi4', provider: 'blinkit', name: 'Amul Taaza Milk', weight: '500 ml', price: 27, eta: '14 min', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80' },
  { id: 'mi5', provider: 'zepto', name: 'Amul Taaza Milk', weight: '500 ml', price: 27, eta: '10 min', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80' },
];

export const STAYS: Stay[] = [
  { id: 's1', provider: 'airbnb', type: 'villa', name: 'Luxury Pool Villa', location: 'Vagator, Goa', rating: 4.9, price: 15000, originalPrice: 18000, imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80', amenities: ['Private Pool', 'Wifi', 'Kitchen'] },
  { id: 's2', provider: 'makemytrip', type: 'hotel', name: 'Taj Mahal Palace', location: 'Colaba, Mumbai', rating: 4.9, price: 12500, originalPrice: 15000, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', amenities: ['Sea View', 'Spa', 'Breakfast'] },
  { id: 's3', provider: 'bookingcom', type: 'apartment', name: 'Cozy Studio Apt', location: 'Indiranagar, BLR', rating: 4.7, price: 3500, originalPrice: 4500, imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', amenities: ['Kitchen', 'Workspace', 'Gym'] },
  { id: 's4', provider: 'oyo', type: 'hotel', name: 'Townhouse 101', location: 'Andheri East, Mumbai', rating: 4.1, price: 1200, originalPrice: 2500, imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80', amenities: ['AC', 'TV', 'Free Wifi'] },
  { id: 's5', provider: 'agoda', type: 'resort', name: 'Wildwoods Nature Resort', location: 'Coorg, Karnataka', rating: 4.6, price: 8500, originalPrice: 10000, imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', amenities: ['Nature Walk', 'Bonfire', 'Meals Included'] },
  { id: 's6', provider: 'airbnb', type: 'hostel', name: 'Zostel Backpacker', location: 'Rishikesh, Goa', rating: 4.5, price: 800, originalPrice: 1200, imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80', amenities: ['Bunk Beds', 'Cafe', 'Events'] },
];
