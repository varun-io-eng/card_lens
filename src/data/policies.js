export const ALL_POLICIES = [
  { id: 'lounge',     name: 'Airport Lounge Access',       icon: '✈️',  category: 'Travel',     desc: 'Complimentary access to domestic & international airport lounges.' },
  { id: 'travel_ins', name: 'Travel Insurance',            icon: '🛡️',  category: 'Travel',     desc: 'Coverage for trip cancellation, lost baggage, and medical emergencies.' },
  { id: 'forex',      name: 'Zero Forex Markup',           icon: '🌐',  category: 'Travel',     desc: 'No foreign currency markup on international transactions.' },
  { id: 'hotel',      name: 'Hotel & Stay Benefits',       icon: '🏨',  category: 'Travel',     desc: 'Complimentary nights, upgrades, or discounts at partner hotels.' },
  { id: 'global_acc', name: 'Global Emergency Assist',     icon: '🆘',  category: 'Travel',     desc: 'Worldwide assistance for card loss, theft, or emergencies abroad.' },
  { id: 'cashback',   name: 'Cashback Rewards',            icon: '💰',  category: 'Rewards',    desc: 'Earn percentage cashback on purchases across all categories.' },
  { id: 'rewards',    name: 'Reward Points Program',       icon: '⭐',  category: 'Rewards',    desc: 'Earn redeemable points on every transaction you make.' },
  { id: 'milestone',  name: 'Milestone Bonuses',           icon: '🏆',  category: 'Rewards',    desc: 'Bonus rewards on reaching annual spending milestones.' },
  { id: 'welcome',    name: 'Welcome / Joining Bonus',     icon: '🎁',  category: 'Rewards',    desc: 'One-time reward points or vouchers on card activation.' },
  { id: 'dining',     name: 'Dining Privileges',           icon: '🍽️',  category: 'Lifestyle',  desc: 'Exclusive discounts and offers at premium partner restaurants.' },
  { id: 'golf',       name: 'Golf Privileges',             icon: '⛳',  category: 'Lifestyle',  desc: 'Complimentary golf rounds and lessons at premium courses.' },
  { id: 'concierge',  name: '24/7 Concierge Service',     icon: '📞',  category: 'Lifestyle',  desc: 'Personal assistance for travel, dining, and lifestyle bookings.' },
  { id: 'fuel',       name: 'Fuel Surcharge Waiver',       icon: '⛽',  category: 'Everyday',   desc: 'Waiver on fuel transaction surcharges at petrol stations.' },
  { id: 'emi',        name: 'EMI / Instalment Plans',      icon: '📅',  category: 'Everyday',   desc: 'Convert large purchases into easy monthly instalments at 0%.' },
  { id: 'purchase',   name: 'Purchase Protection',         icon: '🔒',  category: 'Security',   desc: 'Insurance cover for purchases against theft or accidental damage.' },
  { id: 'zero_liab',  name: 'Zero Liability Protection',   icon: '🛡️',  category: 'Security',   desc: 'Full protection against unauthorized fraudulent transactions.' },
];

export const CATEGORIES = ['All', 'Travel', 'Rewards', 'Lifestyle', 'Everyday', 'Security'];

export const BANKS = [
  'HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank', 'Kotak Mahindra',
  'American Express', 'Citibank', 'Standard Chartered', 'IndusInd Bank',
  'Yes Bank', 'Chase', 'Bank of America', 'Wells Fargo', 'Barclays', 'HSBC',
];

export const TIERS = ['Entry Level', 'Classic', 'Gold', 'Platinum', 'Signature', 'Infinite', 'World Elite'];
export const NETWORKS = ['Visa', 'Mastercard', 'RuPay', 'American Express', 'Diners Club'];

export const CARD_THEMES = [
  { id: 'navy',     label: 'Classic',  from: '#0f2027', via: '#203a43', to: '#2c5364' },
  { id: 'gold',     label: 'Gold',     from: '#1c1408', via: '#3d2a06', to: '#7a5200' },
  { id: 'platinum', label: 'Platinum', from: '#1a1a1a', via: '#2d2d2d', to: '#505050' },
  { id: 'rose',     label: 'Rose',     from: '#1e0a0a', via: '#3d1010', to: '#6b1f1f' },
  { id: 'teal',     label: 'Teal',     from: '#0a1f1e', via: '#0d3b38', to: '#0f5c57' },
];

export function getDemoData(bank, cardName, tier, fee) {
  const isHighEnd = ['Platinum', 'Signature', 'Infinite', 'World Elite'].includes(tier) || parseInt(fee) > 3000;
  const isMid = ['Gold', 'Classic'].includes(tier) || (parseInt(fee) > 500 && parseInt(fee) <= 3000);

  const highEndIds   = ALL_POLICIES.map(p => p.id);
  const midIds       = ['fuel','emi','rewards','zero_liab','cashback','dining','welcome','purchase','travel_ins','milestone'];
  const entryIds     = ['fuel','emi','rewards','zero_liab','cashback'];

  const policies = {};
  for (const p of ALL_POLICIES) {
    if (isHighEnd) {
      policies[p.id] = Math.random() > 0.15 ? 'has' : 'partial';
    } else if (isMid) {
      policies[p.id] = midIds.includes(p.id)
        ? (Math.random() > 0.3 ? 'has' : 'partial')
        : 'not';
    } else {
      policies[p.id] = entryIds.includes(p.id)
        ? (Math.random() > 0.4 ? 'has' : 'partial')
        : 'not';
    }
  }

  const hasCount = Object.values(policies).filter(v => v === 'has').length;
  const score = Math.round((hasCount / ALL_POLICIES.length) * 100);
  const tierLabel = tier || 'Standard';

  return {
    cardName: cardName || 'Credit Card',
    bankName: bank || 'Your Bank',
    score,
    summary: `This ${tierLabel} card from ${bank || 'your bank'} offers a ${score >= 70 ? 'comprehensive' : score >= 45 ? 'moderate' : 'basic'} benefit set. ${isHighEnd ? 'As a premium card, it covers most essential travel and lifestyle benefits.' : isMid ? 'It covers everyday essentials but may lack premium travel perks.' : 'Best suited for everyday spending with limited premium features.'}`,
    policies,
  };
}
