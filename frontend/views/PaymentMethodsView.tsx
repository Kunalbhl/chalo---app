import React, { useState } from 'react';
import { ArrowLeft, Plus, Wallet, CreditCard, Smartphone, Landmark, Banknote, CheckCircle2, ChevronRight, ShieldCheck, X, Search, Loader2, User, AlertCircle, Gift, RefreshCw } from 'lucide-react';
import { SavedMethod, WalletItem } from '../types';

interface PaymentMethodsViewProps {
  onBack: () => void;
  walletBalance: number;
  rewardPoints: number;
  onConvertPoints: (points: number) => boolean;
  preferredPayment: string;
  onUpdatePreferredPayment: (methodId: string) => void;
  upis: SavedMethod[];
  setUpis: React.Dispatch<React.SetStateAction<SavedMethod[]>>;
  cards: SavedMethod[];
  setCards: React.Dispatch<React.SetStateAction<SavedMethod[]>>;
  wallets: WalletItem[];
  setWallets: React.Dispatch<React.SetStateAction<WalletItem[]>>;
}

const POPULAR_BANKS = [
  { id: 'sbi', name: 'State Bank of India', domain: 'onlinesbi.sbi' },
  { id: 'hdfc', name: 'HDFC Bank', domain: 'hdfcbank.com' },
  { id: 'icici', name: 'ICICI Bank', domain: 'icicibank.com' },
  { id: 'axis', name: 'Axis Bank', domain: 'axisbank.com' },
  { id: 'kotak', name: 'Kotak Mahindra', domain: 'kotak.com' },
  { id: 'pnb', name: 'Punjab National Bank', domain: 'pnbindia.in' },
  { id: 'bob', name: 'Bank of Baroda', domain: 'bankofbaroda.in' },
  { id: 'yes', name: 'Yes Bank', domain: 'yesbank.in' },
];

const DISCOVERED_UPIS = [
  { id: 'upi-phonepe', title: 'PhonePe', subtitle: '9876543210@ybl', iconUrl: 'https://icon.horse/icon/phonepe.com' },
  { id: 'upi-bhim', title: 'BHIM UPI', subtitle: '9876543210@upi', iconUrl: 'https://icon.horse/icon/bhimupi.org.in' },
  { id: 'upi-cred', title: 'CRED Pay', subtitle: 'arjun@cred', iconUrl: 'https://icon.horse/icon/cred.club' },
];

const getUpiProviderDetails = (upiId: string) => {
  const handle = upiId.split('@')[1]?.toLowerCase();
  switch (handle) {
    case 'okhdfcbank': case 'okicici': case 'oksbi': case 'okaxis':
      return { title: 'Google Pay', iconUrl: 'https://icon.horse/icon/pay.google.com' };
    case 'ybl': case 'ibl': case 'axl':
      return { title: 'PhonePe', iconUrl: 'https://icon.horse/icon/phonepe.com' };
    case 'paytm':
      return { title: 'Paytm', iconUrl: 'https://icon.horse/icon/paytm.com' };
    case 'aplay':
      return { title: 'Amazon Pay', iconUrl: 'https://icon.horse/icon/amazon.in' };
    case 'upi':
      return { title: 'BHIM UPI', iconUrl: 'https://icon.horse/icon/bhimupi.org.in' };
    case 'cred':
      return { title: 'CRED Pay', iconUrl: 'https://icon.horse/icon/cred.club' };
    default:
      return { title: 'UPI', iconUrl: undefined };
  }
};

const getCardProviderDetails = (cardNumber: string) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  let network = '';
  let iconUrl = undefined;

  if (cleanNumber.startsWith('4')) { network = 'Visa'; iconUrl = 'https://icon.horse/icon/visa.com'; }
  else if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) { network = 'Mastercard'; iconUrl = 'https://icon.horse/icon/mastercard.com'; }
  else if (/^3[47]/.test(cleanNumber)) { network = 'Amex'; iconUrl = 'https://icon.horse/icon/americanexpress.com'; }
  else if (/^6(0|5|8)/.test(cleanNumber)) { network = 'RuPay'; iconUrl = 'https://icon.horse/icon/npci.org.in'; }

  const binMap: Record<string, { bank: string, type: 'credit' | 'debit', bankIcon: string, gradient: string }> = {
    '411111': { bank: 'HDFC Bank', type: 'credit', bankIcon: 'https://icon.horse/icon/hdfcbank.com', gradient: 'from-blue-800 to-indigo-950' },
    '424242': { bank: 'ICICI Bank', type: 'debit', bankIcon: 'https://icon.horse/icon/icicibank.com', gradient: 'from-orange-700 to-slate-950' },
    '437551': { bank: 'SBI', type: 'debit', bankIcon: 'https://icon.horse/icon/onlinesbi.sbi', gradient: 'from-teal-700 to-slate-950' },
    '510000': { bank: 'Axis Bank', type: 'credit', bankIcon: 'https://icon.horse/icon/axisbank.com', gradient: 'from-purple-800 to-slate-950' },
    '552289': { bank: 'Kotak Mahindra', type: 'debit', bankIcon: 'https://icon.horse/icon/kotak.com', gradient: 'from-red-800 to-slate-950' },
    '607152': { bank: 'PNB', type: 'debit', bankIcon: 'https://icon.horse/icon/pnbindia.in', gradient: 'from-amber-800 to-slate-950' },
  };

  const bin6 = cleanNumber.substring(0, 6);
  const binMatch = binMap[bin6];

  if (binMatch) {
    return {
      bankName: binMatch.bank,
      network,
      actualType: binMatch.type,
      iconUrl: binMatch.bankIcon,
      gradient: binMatch.gradient
    };
  }

  return {
    bankName: '',
    network,
    actualType: 'unknown',
    iconUrl,
    gradient: 'from-slate-800 to-slate-950'
  };
};

export const PaymentMethodsView: React.FC<PaymentMethodsViewProps> = ({ onBack, walletBalance, rewardPoints, onConvertPoints, preferredPayment, onUpdatePreferredPayment, upis, setUpis, cards, setCards, wallets, setWallets }) => {
  const [defaultMethod, setDefaultMethod] = useState<string>(preferredPayment);
  const [activeModal, setActiveModal] = useState<'none' | 'upi' | 'card' | 'wallet' | 'bank' | 'convert'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [manualUpi, setManualUpi] = useState('');
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [bankSearch, setBankSearch] = useState('');
  const [cardError, setCardError] = useState('');
  
  const [detectedBank, setDetectedBank] = useState('');
  const [detectedNetwork, setDetectedNetwork] = useState('');
  const [detectedIcon, setDetectedIcon] = useState<string | undefined>(undefined);
  const [cardGradient, setCardGradient] = useState('from-slate-800 to-slate-950');
  const [pointsToConvert, setPointsToConvert] = useState<number>(100);

  const handleSetDefault = (id: string) => {
    setDefaultMethod(id);
    onUpdatePreferredPayment(id);
  };

  const openModal = (modal: 'upi' | 'card' | 'wallet' | 'bank' | 'convert', item?: any) => {
    setActiveModal(modal);
    setSelectedItem(item || null);
    if (modal === 'upi') {
      setIsProcessing(true);
      setProcessingText('Discovering UPI apps on device...');
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    }
  };

  const closeModal = () => {
    if (isProcessing) return;
    setActiveModal('none');
    setSelectedItem(null);
    setManualUpi('');
    setCardType('credit');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setSaveForFuture(true);
    setSetAsDefault(true);
    setBankSearch('');
    setCardError('');
    setDetectedBank('');
    setDetectedNetwork('');
    setDetectedIcon(undefined);
    setCardGradient('from-slate-800 to-slate-950');
  };

  const handleAddUpi = (upi: any) => {
    setIsProcessing(true);
    setProcessingText(`Verifying ${upi.title}...`);
    setTimeout(() => {
      if (!upis.find(u => u.id === upi.id)) {
        setUpis([...upis, { ...upi, type: 'upi' }]);
      }
      handleSetDefault(upi.id);
      setIsProcessing(false);
      closeModal();
    }, 1500);
  };

  const handleVerifyManualUpi = () => {
    if (!manualUpi.includes('@')) {
      alert('Please enter a valid UPI ID containing "@"');
      return;
    }
    setIsProcessing(true);
    setProcessingText(`Verifying ${manualUpi}...`);
    setTimeout(() => {
      const details = getUpiProviderDetails(manualUpi);
      const newUpiId = `upi-${Date.now()}`;
      const newUpi: SavedMethod = {
        id: newUpiId,
        type: 'upi',
        title: details.title,
        subtitle: manualUpi,
        iconUrl: details.iconUrl,
        fallbackIcon: <Smartphone className="w-6 h-6 text-slate-600" />
      };
      setUpis([...upis, newUpi]);
      handleSetDefault(newUpiId);
      setIsProcessing(false);
      closeModal();
    }, 1500);
  };

  const validateCardType = (number: string, type: 'credit' | 'debit') => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.length >= 6) {
      const details = getCardProviderDetails(cleanNumber);
      setDetectedBank(details.bankName);
      setDetectedNetwork(details.network);
      setDetectedIcon(details.iconUrl);
      setCardGradient(details.gradient);

      if (details.actualType !== 'unknown' && details.actualType !== type) {
        setCardError(`This number belongs to a ${details.actualType.toUpperCase()} card. Please switch the card type above.`);
      } else {
        setCardError('');
      }
    } else {
      setDetectedBank('');
      setDetectedNetwork('');
      setDetectedIcon(undefined);
      setCardGradient('from-slate-800 to-slate-950');
      setCardError('');
    }
  };

  const handleCardTypeChange = (type: 'credit' | 'debit') => {
    setCardType(type);
    validateCardType(cardNumber, type);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
    validateCardType(value, cardType);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length === 2 && cardExpiry.length === 3) {
      value = value.substring(0, 1);
    } else {
      value = value.replace(/\D/g, '');
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
    }
    setCardExpiry(value);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = cardNumber.replace(/\s/g, '').trim();
    if (cleanNumber.length < 15) {
      setCardError('Please enter a valid card number.');
      return;
    }

    const details = getCardProviderDetails(cardNumber);

    if (details.actualType !== 'unknown' && details.actualType !== cardType) {
      setCardError(`Invalid category. This number belongs to a ${details.actualType.toUpperCase()} card.`);
      return;
    }

    setIsProcessing(true);
    setProcessingText('Securely processing card...');
    setTimeout(() => {
      const newCardId = `card-${Date.now()}`;
      const last4 = cleanNumber.slice(-4) || 'XXXX';
      
      const typeString = cardType === 'credit' ? 'Credit' : 'Debit';
      const titleParts = [];
      if (details.bankName) titleParts.push(details.bankName);
      if (details.network) titleParts.push(details.network);
      titleParts.push(typeString, 'Card');
      
      const finalTitle = titleParts.join(' ');

      const newCard: SavedMethod = {
        id: newCardId,
        type: 'card',
        title: finalTitle,
        subtitle: `${cardName.toUpperCase()} • **** ${last4}`,
        iconUrl: details.iconUrl,
        fallbackIcon: <CreditCard className="w-6 h-6 text-slate-600" />,
        sessionOnly: !saveForFuture
      };

      setCards([...cards, newCard]);
      
      if (setAsDefault && saveForFuture) {
        handleSetDefault(newCardId);
      } else if (!saveForFuture) {
        handleSetDefault(newCardId);
      }

      setIsProcessing(false);
      closeModal();
    }, 2000);
  };

  const handleLinkWallet = () => {
    if (!selectedItem) return;
    setIsProcessing(true);
    setProcessingText(`Linking ${selectedItem.title}...`);
    setTimeout(() => {
      setWallets(wallets.map(w => {
        if (w.id === selectedItem.id) {
          return { ...w, isLinked: true, balance: Math.floor(Math.random() * 1000) + 100 };
        }
        return w;
      }));
      handleSetDefault(selectedItem.id);
      setIsProcessing(false);
      closeModal();
    }, 2000);
  };

  const handleSelectBank = (bank: any) => {
    setIsProcessing(true);
    setProcessingText(`Redirecting to ${bank.name}...`);
    setTimeout(() => {
      setIsProcessing(false);
      closeModal();
      alert(`Simulated redirect to ${bank.name} Net Banking portal.`);
    }, 1500);
  };

  const handleConvertSubmit = () => {
    setIsProcessing(true);
    setProcessingText('Converting points to wallet cash...');
    setTimeout(() => {
      const success = onConvertPoints(pointsToConvert);
      setIsProcessing(false);
      if (success) {
        closeModal();
      } else {
        alert('Insufficient reward points.');
      }
    }, 1500);
  };

  const filteredBanks = POPULAR_BANKS.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative text-slate-800">
      {/* Header */}
      <div className="bg-slate-900/95 border-b border-slate-800/50 pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-white">Payment Methods</h1>
            <p className="text-xs font-medium text-slate-400">Manage your saved payments</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        
        {/* Chalo Pay Wallet */}
        <div className="bg-gradient-to-br from-slate-900 to-brand-950 rounded-3xl p-5 text-white shadow-float relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-5 h-5 text-brand-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-100">Chalo Pay</span>
              </div>
              <h2 className="text-3xl font-bold mt-1">₹{walletBalance.toFixed(2)}</h2>
            </div>
            <button className="bg-white text-slate-900 text-sm font-bold px-4 py-2 rounded-xl shadow-sm active:scale-95 transition-transform">
              Add Money
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Rewards Conversion Section */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              <Gift className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Convert Reward Points</h3>
              <p className="text-xs text-slate-500 mt-0.5">{rewardPoints} points available (20 pts = ₹1)</p>
            </div>
          </div>
          <button 
            onClick={() => openModal('convert')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Convert
          </button>
        </div>

        {/* UPI Section */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">UPI</h2>
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
            {upis.map(upi => (
              <PaymentItem 
                key={upi.id}
                id={upi.id}
                title={upi.title}
                subtitle={upi.subtitle}
                iconUrl={upi.iconUrl}
                fallbackIcon={<Smartphone className="w-6 h-6 text-slate-400" />}
                isDefault={defaultMethod === upi.id}
                onSelect={() => handleSetDefault(upi.id)}
              />
            ))}
            <button 
              onClick={() => openModal('upi')}
              className="w-full flex items-center p-4 text-brand-600 active:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mr-4 border border-brand-100">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm">Add New UPI ID</span>
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Credit & Debit Cards</h2>
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
            {cards.map(card => (
              <PaymentItem 
                key={card.id}
                id={card.id}
                title={card.title}
                subtitle={card.subtitle}
                iconUrl={card.iconUrl}
                fallbackIcon={card.fallbackIcon || <CreditCard className="w-6 h-6 text-slate-400" />}
                isDefault={defaultMethod === card.id}
                onSelect={() => handleSetDefault(card.id)}
                sessionOnly={card.sessionOnly}
              />
            ))}
            <button 
              onClick={() => openModal('card')}
              className="w-full flex items-center p-4 text-brand-600 active:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mr-4 border border-brand-100">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm">Add New Card</span>
            </button>
          </div>
        </div>

        {/* Wallets Section */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Wallets</h2>
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
            {wallets.map(wallet => (
              wallet.isLinked ? (
                <PaymentItem 
                  key={wallet.id}
                  id={wallet.id}
                  title={wallet.title}
                  subtitle={`Balance: ₹${wallet.balance}`}
                  iconUrl={wallet.iconUrl}
                  fallbackIcon={<Wallet className="w-6 h-6 text-slate-400" />}
                  isDefault={defaultMethod === wallet.id}
                  onSelect={() => handleSetDefault(wallet.id)}
                />
              ) : (
                <div key={wallet.id} className="flex items-center p-4 border-t border-slate-100 first:border-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mr-4 overflow-hidden shadow-sm">
                    <img src={wallet.iconUrl} alt={wallet.title} className="w-6 h-6 object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-sm">{wallet.title}</h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">Not linked</p>
                  </div>
                  <button 
                    onClick={() => openModal('wallet', wallet)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-600 border border-brand-100 active:bg-brand-100 transition-colors"
                  >
                    Link
                  </button>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Other Options */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Other Options</h2>
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
            <button 
              onClick={() => openModal('bank')}
              className="w-full flex items-center p-4 border-b border-slate-50 active:bg-slate-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mr-4 text-slate-500 border border-slate-100">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm">Net Banking</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">All major Indian banks supported</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
            <PaymentItem 
              id="cash"
              title="Cash on Delivery"
              subtitle="Pay directly to the partner"
              fallbackIcon={<Banknote className="w-5 h-5 text-emerald-600" />}
              isDefault={defaultMethod === 'cash'}
              onSelect={() => handleSetDefault('cash')}
              iconBg="bg-emerald-50 border-emerald-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pt-4">
          <ShieldCheck className="w-4 h-4" /> 100% Secure Payments
        </div>
      </div>

      {/* --- Modals / Bottom Sheets --- */}
      {activeModal !== 'none' && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white rounded-t-[2rem] p-6 relative z-10 border-t border-slate-100 max-h-[85vh] flex flex-col text-slate-800">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 z-20 hover:bg-slate-200 transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Processing State Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-t-[2rem]">
                <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-800">{processingText}</p>
              </div>
            )}

            {/* Convert Rewards Modal */}
            {activeModal === 'convert' && (
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Convert Reward Points</h2>
                <p className="text-sm text-slate-500 mb-6">Convert your points instantly to Chalo Pay wallet cash.</p>
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Conversion Rate</p>
                  <p className="text-lg font-bold text-amber-600">20 Points = ₹1.00 Cash</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Points to Convert</label>
                    <input 
                      type="number" 
                      value={pointsToConvert}
                      onChange={(e) => setPointsToConvert(Math.min(rewardPoints, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-center text-2xl"
                    />
                  </div>

                  <div className="flex justify-between text-sm font-semibold text-slate-500 px-1">
                    <span>You will receive:</span>
                    <span className="text-emerald-600 font-bold">₹{(pointsToConvert / 20).toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={handleConvertSubmit}
                    disabled={pointsToConvert <= 0 || pointsToConvert > rewardPoints}
                    className="w-full py-4 mt-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors disabled:opacity-50"
                  >
                    Confirm Conversion
                  </button>
                </div>
              </div>
            )}

            {/* UPI Modal Content */}
            {activeModal === 'upi' && (
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Add UPI ID</h2>
                <p className="text-sm text-slate-500 mb-6">Select an app from your device or enter manually.</p>
                
                <div className="space-y-3 overflow-y-auto pb-4">
                  {DISCOVERED_UPIS.map(upi => {
                    const isAlreadyAdded = upis.some(u => u.id === upi.id);
                    return (
                      <button 
                        key={upi.id}
                        onClick={() => !isAlreadyAdded && handleAddUpi(upi)}
                        disabled={isAlreadyAdded}
                        className={`w-full flex items-center p-4 rounded-2xl border transition-all text-left ${
                          isAlreadyAdded ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-brand-300 active:bg-slate-50'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center mr-4 overflow-hidden shadow-sm bg-white">
                          <img src={upi.iconUrl} alt={upi.title} className="w-8 h-8 object-contain" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800">{upi.title}</h3>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{upi.subtitle}</p>
                        </div>
                        {isAlreadyAdded && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase border border-emerald-100">Added</span>}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Enter Manually</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={manualUpi}
                      onChange={(e) => setManualUpi(e.target.value)}
                      placeholder="e.g. name@bank" 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-800"
                    />
                    <button 
                      onClick={handleVerifyManualUpi}
                      disabled={!manualUpi}
                      className="bg-brand-600 text-white font-bold px-6 py-3 rounded-xl active:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card Modal Content */}
            {activeModal === 'card' && (
              <div className="flex flex-col h-full overflow-y-auto hide-scrollbar">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Add New Card</h2>
                <p className="text-sm text-slate-500 mb-4">We securely process your card for faster payments.</p>
                
                {/* Interactive Card Preview */}
                <div className={`w-full aspect-[1.58/1] rounded-2xl bg-gradient-to-br ${cardGradient} p-6 text-white flex flex-col justify-between shadow-lg mb-6 relative overflow-hidden transition-all duration-500`}>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                        {detectedBank ? detectedBank : 'Select Bank'}
                      </p>
                      <p className="text-xs font-bold text-white/80 mt-0.5">
                        {cardType.toUpperCase()} CARD
                      </p>
                    </div>
                    {detectedIcon ? (
                      <div className="w-10 h-10 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-sm">
                        <img src={detectedIcon} alt="Bank Logo" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                        <Landmark className="w-5 h-5 text-white/60" />
                      </div>
                    )}
                  </div>

                  <div className="relative z-10">
                    <p className="text-lg font-mono tracking-widest font-semibold">
                      {cardNumber ? cardNumber : '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">Card Holder</p>
                      <p className="text-xs font-bold tracking-wide truncate max-w-[180px]">
                        {cardName ? cardName.toUpperCase() : 'YOUR NAME'}
                      </p>
                    </div>
                    <div className="flex gap-4 text-right">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">Expires</p>
                        <p className="text-xs font-bold font-mono">{cardExpiry ? cardExpiry : 'MM/YY'}</p>
                      </div>
                      {detectedNetwork && (
                        <span className="text-xs font-black tracking-wider uppercase bg-white/10 px-2 py-1 rounded border border-white/20">
                          {detectedNetwork}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl mb-4 border border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => handleCardTypeChange('credit')} 
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${cardType === 'credit' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                  >
                    Credit Card
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleCardTypeChange('debit')} 
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${cardType === 'debit' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                  >
                    Debit Card
                  </button>
                </div>

                <form onSubmit={handleAddCard} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Name on Card</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        placeholder="JOHN DOE" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000" 
                        className={`w-full bg-slate-50 border rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 outline-none font-medium tracking-wide ${cardError ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-brand-500'}`}
                      />
                    </div>
                    
                    {/* Real-time Bank Detection Badge */}
                    {(detectedBank || detectedNetwork) && !cardError && (
                      <div className="flex items-center gap-2 mt-2 ml-1 p-2 bg-brand-500/10 rounded-lg border border-brand-500/20 animate-[fadeIn_0.2s_ease-out]">
                        {detectedIcon && <img src={detectedIcon} alt="Bank" className="w-5 h-5 object-contain" />}
                        <span className="text-xs font-bold text-brand-400">
                          {detectedBank ? `${detectedBank} ` : ''}{detectedNetwork} {detectedBank ? (cardType === 'credit' ? 'Credit' : 'Debit') : ''}
                        </span>
                      </div>
                    )}

                    {cardError && (
                      <div className="flex items-start gap-1.5 mt-2 ml-1 text-red-500 animate-[fadeIn_0.2s_ease-out]">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-bold leading-tight">{cardError}</p>
                      </div>
                    )}
                    
                    <p className="text-[10px] text-slate-500 mt-2 ml-1">
                      Test BINs: 411111 (HDFC Credit), 424242 (ICICI Debit), 437551 (SBI Debit)
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium text-center tracking-wide"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">CVV</label>
                      <input 
                        type="password" 
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium text-center tracking-widest"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2 pb-1">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="saveCard" 
                        checked={saveForFuture}
                        onChange={(e) => setSaveForFuture(e.target.checked)}
                        className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 accent-brand-600"
                      />
                      <label htmlFor="saveCard" className="text-sm font-medium text-slate-700 cursor-pointer">
                        Save for future transactions
                      </label>
                    </div>
                    
                    {saveForFuture && (
                      <div className="flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
                        <input 
                          type="checkbox" 
                          id="setDefault" 
                          checked={setAsDefault}
                          onChange={(e) => setSetAsDefault(e.target.checked)}
                          className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 accent-brand-600"
                        />
                        <label htmlFor="setDefault" className="text-sm font-medium text-slate-700 cursor-pointer">
                          Set as default payment method
                        </label>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={!!cardError}
                    className="w-full py-4 mt-2 bg-brand-600 text-white rounded-xl font-bold text-lg shadow-md active:bg-brand-700 transition-colors disabled:opacity-50 disabled:active:scale-100"
                  >
                    {saveForFuture ? 'Save Card' : 'Use Card'}
                  </button>
                </form>
              </div>
            )}

            {/* Wallet Modal Content */}
            {activeModal === 'wallet' && selectedItem && (
              <div className="flex flex-col items-center text-center pt-4">
                <div className="w-20 h-20 rounded-3xl border border-slate-200 flex items-center justify-center mb-4 shadow-soft bg-white">
                  <img src={selectedItem.iconUrl} alt={selectedItem.title} className="w-12 h-12 object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Link {selectedItem.title}</h2>
                <p className="text-sm text-slate-500 mb-8 px-4">
                  We will send an OTP to your registered mobile number to fetch your wallet balance.
                </p>
                <button 
                  onClick={handleLinkWallet}
                  className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg shadow-md active:bg-brand-700 transition-colors"
                >
                  Send OTP
                </button>
              </div>
            )}

            {/* Net Banking Modal Content */}
            {activeModal === 'bank' && (
              <div className="flex flex-col h-full max-h-[70vh]">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Select Bank</h2>
                <div className="relative mb-4">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Search your bank..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 pb-4">
                  {filteredBanks.map(bank => (
                    <button 
                      key={bank.id}
                      onClick={() => handleSelectBank(bank)}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-800 bg-slate-950 hover:border-brand-500/50 active:bg-slate-800 transition-all text-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                        <img src={`https://icon.horse/icon/${bank.domain}`} alt={bank.name} className="w-6 h-6 object-contain" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">{bank.name}</span>
                    </button>
                  ))}
                  {filteredBanks.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-slate-500 text-sm">
                      No banks found matching "{bankSearch}"
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

interface PaymentItemProps {
  id: string;
  title: string;
  subtitle: string;
  iconUrl?: string;
  fallbackIcon: React.ReactNode;
  isDefault: boolean;
  onSelect: () => void;
  iconBg?: string;
  sessionOnly?: boolean;
}

const PaymentItem: React.FC<PaymentItemProps> = ({ id, title, subtitle, iconUrl, fallbackIcon, isDefault, onSelect, iconBg = 'bg-white', sessionOnly }) => {
  return (
    <div 
      onClick={onSelect}
      className="flex items-center p-4 border-b border-slate-50 last:border-0 cursor-pointer active:bg-slate-50 transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center mr-4 overflow-hidden shadow-sm ${iconBg}`}>
        {iconUrl ? (
          <img 
            src={iconUrl} 
            alt={title} 
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '';
            }}
          />
        ) : (
          fallbackIcon
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          {sessionOnly && (
            <span className="text-[8px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider border border-slate-200">
              Session
            </span>
          )}
          {isDefault && (
            <span className="text-[8px] font-bold bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded uppercase tracking-wider border border-brand-200">
              Preferred
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <div className="ml-4">
        {isDefault ? (
          <CheckCircle2 className="w-6 h-6 text-brand-600" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
        )}
      </div>
    </div>
  );
};