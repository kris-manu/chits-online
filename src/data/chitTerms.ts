export interface ChitTerm {
  id: string;
  termMl: string;
  termEn: string;
  descMl: string;
  descEn: string;
  exampleMl?: string;
  exampleEn?: string;
}

export interface HowItWorksStep {
  step: number;
  titleMl: string;
  titleEn: string;
  descMl: string;
  descEn: string;
  icon: string;
}

export interface FAQItem {
  id: string;
  questionMl: string;
  questionEn: string;
  answerMl: string;
  answerEn: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    titleMl: "അംഗം ചിട്ടിയിൽ ചേരുന്നു",
    titleEn: "Member Joins Chit",
    descMl: "ഒരേ താല്പര്യമുള്ള വിശ്വസ്തരായ ഒരു കൂട്ടം അംഗങ്ങളെ (ഉദാ: 100 പേർ) ഫോർമാൻ ചിട്ടിയിൽ ഒന്നിപ്പിക്കുന്നു.",
    descEn: "A group of like-minded individuals (e.g., 100 subscribers) are enrolled in a registered chit scheme by the foreman.",
    icon: "group_add"
  },
  {
    step: 2,
    titleMl: "മാസ തവണ അടയ്ക്കുന്നു",
    titleEn: "Pay Monthly Installment",
    descMl: "എല്ലാ അംഗങ്ങളും തങ്ങളുടെ മാസ തവണ പണം കൃത്യസമയത്ത് അടയ്ക്കുന്നു.",
    descEn: "Every subscriber pays their fixed monthly contribution at the start of the round.",
    icon: "payments"
  },
  {
    step: 3,
    titleMl: "ചിട്ടി തുക ശേഖരിക്കുന്നു",
    titleEn: "Monthly Pool Collected",
    descMl: "എല്ലാവരുടെയും പ്രതിമാസ തവണകൾ ചേർത്തു വലിയൊരു തുക (ചിട്ടി ഫണ്ട് പൂൾ) ഉണ്ടാക്കുന്നു.",
    descEn: "Installments from all members are pooled together to form the total monthly chit value.",
    icon: "savings"
  },
  {
    step: 4,
    titleMl: "ലേലം നടത്തുന്നു",
    titleEn: "Auction Conducted",
    descMl: "തുക ആവശ്യമുള്ള അംഗങ്ങൾക്കായി ലേലം നടത്തുന്നു. ഏറ്റവും കൂടുതൽ ഡിസ്കൗണ്ട് വിട്ടുനൽകുന്ന ആൾ ലേലത്തിൽ വിജയിക്കുന്നു.",
    descEn: "An auction is held. The member who agrees to forego the highest discount to get immediate cash wins.",
    icon: "gavel"
  },
  {
    step: 5,
    titleMl: "സമ്മാന തുക കൈപ്പറ്റുന്നു",
    titleEn: "Winner Receives Prize",
    descMl: "ലേലവിജയി ആവശ്യമായ ജാമ്യങ്ങൾ നൽകി ലേല ഡിസ്കൗണ്ടും ഫോർമാൻ കമ്മീഷനും കഴിച്ച് ബാക്കി തുക സ്വന്തമാക്കുന്നു.",
    descEn: "The winner submits required security/guarantees and receives the prize money (Pool minus Auction Discount and Foreman Commission).",
    icon: "monetization_on"
  },
  {
    step: 6,
    titleMl: "ലാഭവിഹിതം വിതരണം ചെയ്യുന്നു",
    titleEn: "Dividend Distributed",
    descMl: "ലേലത്തിൽ ഒഴിവാക്കിയ തുകയിൽ നിന്നും ഫോർമാൻ കമ്മീഷൻ കഴിച്ച് ബാക്കി ഡിവിഡന്റായി എല്ലാ അംഗങ്ങൾക്കും അടുത്ത തവണയിൽ കുറച്ചു നൽകുന്നു.",
    descEn: "The auction discount (minus foreman commission) is split equally among all members as a dividend, reducing their next installment.",
    icon: "account_balance_wallet"
  },
  {
    step: 7,
    titleMl: "ചിട്ടി കാലാവധി പൂർത്തിയാകുന്നു",
    titleEn: "Cycle Repeats until End",
    descMl: "എല്ലാ അംഗങ്ങൾക്കും ഒരു തവണയെങ്കിലും പണം ലഭിക്കുന്നത് വരെ ഈ പ്രക്രിയ മാസങ്ങളോളം തുടരുന്നു.",
    descEn: "The process repeats monthly until every subscriber has won the prize money once and the period ends.",
    icon: "check_circle"
  }
];

export const chitTerms: ChitTerm[] = [
  {
    id: "chit-fund",
    termMl: "ചിട്ടി",
    termEn: "Chit Fund",
    descMl: "ഒരു കൂട്ടം ആളുകൾ ചേർന്ന് നിശ്ചിത തുക വീതം തവണകളായി അടയ്ക്കുകയും, ലേലം വഴിയോ നറുക്കെടുപ്പിലൂടെയോ ആ തുക ഒരുമിച്ച് ലഭിക്കുകയും ചെയ്യുന്ന സമ്പാദ്യ-വായ്പ പദ്ധതി.",
    descEn: "A savings and credit system where a group of people contribute a fixed amount periodically, and the collected pool is awarded to a member through auctions or draws.",
    exampleMl: "ഉദാഹരണത്തിന്, 50 പേർ ചേർന്നുള്ള ചിട്ടിയിൽ എല്ലാവരും മാസം തോറും നിശ്ചിത തുക അടയ്ക്കുന്നു.",
    exampleEn: "For instance, a group of 50 subscribers each contributing a set monthly fee."
  },
  {
    id: "chit-value",
    termMl: "ചിട്ടി തുക",
    termEn: "Chit Value",
    descMl: "ഒരു ചിട്ടിയുടെ ആകെ തുകയാണിത്. ലേലങ്ങളൊന്നുമില്ലാതെ ഒരു അംഗത്തിന് ലഭിക്കുന്ന പരമാവധി തുക ഇതാണ്. ഇതിനെ 'ഫെയ്സ് വാല്യൂ' എന്നും വിളിക്കുന്നു.",
    descEn: "The total value of the chit scheme, also called the gross value or face value.",
    exampleMl: "25,000 രൂപ തവണകളായുള്ള 100 മാസ ചിട്ടിയുടെ ആകെ തുക ₹25,00,000 ആണ്.",
    exampleEn: "An installment of ₹25,00,000 per month for 100 months equals a Chit Value of ₹25,00,000."
  },
  {
    id: "monthly-installment",
    termMl: "മാസ തവണ",
    termEn: "Monthly Installment",
    descMl: "ഒരു ചിട്ടി അംഗം ഓരോ മാസവും ചിട്ടിയിലേക്ക് അടയ്ക്കേണ്ട അടിസ്ഥാന തുകയാണിത്. ഡിവിഡന്റ് ലഭിക്കുമ്പോൾ ഈ അടവ് തുക കുറയാറുണ്ട്.",
    descEn: "The amount a subscriber must pay to the chit fund each month. This can decrease depending on the monthly dividend earned.",
    exampleMl: "25 ലക്ഷത്തിന്റെ 100 മാസ ചിട്ടിയിൽ ആദ്യ മാസ തവണ 25,000 രൂപയാണ്.",
    exampleEn: "In a ₹25 Lakh chit of 100 months, the base monthly installment is ₹25,00,000."
  },
  {
    id: "subscriber",
    termMl: "അംഗം",
    termEn: "Subscriber / Member",
    descMl: "ചിട്ടിയിൽ പങ്കാളിയാവുകയും പ്രതിമാസ തവണകൾ മുടങ്ങാതെ അടയ്ക്കുകയും ചെയ്യുന്ന വ്യക്തി.",
    descEn: "A person who joins the chit fund and agrees to pay the periodic installments."
  },
  {
    id: "chit-period",
    termMl: "ചിട്ടി കാലാവധി",
    termEn: "Chit Period",
    descMl: "ചിട്ടി പൂർത്തിയാകാൻ എടുക്കുന്ന ആകെ മാസങ്ങൾ അല്ലെങ്കിൽ തവണകളുടെ എണ്ണം.",
    descEn: "The total duration of the chit scheme, usually measured in months or installments."
  },
  {
    id: "prize-money",
    termMl: "സമ്മാന തുക",
    termEn: "Prize Money",
    descMl: "ലേലം ജയിച്ച അംഗത്തിന് ഫോർമാൻ കമ്മീഷനും ലേല ഡിസ്കൗണ്ടും കഴിച്ച് യഥാർത്ഥത്തിൽ കൈയിൽ ലഭിക്കുന്ന തുക.",
    descEn: "The actual amount received by the winning bidder after deducting foreman commission and bid discount.",
    exampleMl: "25 ലക്ഷത്തിന്റെ ചിട്ടി ₹5 ലക്ഷം രൂപ ഡിസ്കൗണ്ടിൽ ലേലം ഉറപ്പിച്ചാൽ, 5% ഫോർമാൻ കമ്മീഷൻ കഴിച്ച് ₹18,75,000 രൂപ വിജയിക്ക് ലഭിക്കും.",
    exampleEn: "For a ₹25L chit bid at ₹5L discount, the winner gets ₹18,75,000 (after 5% foreman commission of ₹1,25,000)."
  },
  {
    id: "auction",
    termMl: "ലേലം",
    termEn: "Auction",
    descMl: "ഓരോ മാസവും വരിസംഖ്യ അടച്ചവരിൽ നിന്നും തുക ആവശ്യമുള്ളയാളെ കണ്ടെത്താൻ നടത്തുന്ന ലേല പ്രക്രിയ. ഏറ്റവും കൂടുതൽ തുക קיഴിവ് നൽകാൻ തയ്യാറാകുന്നയാൾക്ക് ചിട്ടി ലഭിക്കും.",
    descEn: "The process conducted every month to find a member who needs the pool amount. The member willing to forego the highest discount wins.",
    exampleMl: "പണത്തിന് അടിയന്തര ആവശ്യക്കാരായ പല അംഗങ്ങൾ ചേർന്ന് ചിട്ടി തുക കൈപ്പറ്റാൻ മത്സരിക്കുന്ന പ്രക്രിയ.",
    exampleEn: "Several members compete to receive the pooled cash by bidding the discount rate higher."
  },
  {
    id: "bid-amount",
    termMl: "ലേല തുക",
    termEn: "Bid Amount",
    descMl: "ചിട്ടി തുക സ്വന്തമാക്കാനായി ഒരു അംഗം വിട്ടുനൽകാൻ സമ്മതിക്കുന്ന തുക (ഡിസ്കൗണ്ട് തുക).",
    descEn: "The discount amount a subscriber agrees to forego in order to win the chit auction."
  },
  {
    id: "discount",
    termMl: "ഡിസ്കൗണ്ട്",
    termEn: "Discount",
    descMl: "ലേലം വിളിക്കുന്ന അംഗം ചിട്ടി തുകയിൽ നിന്ന് കുറയ്ക്കാൻ സമ്മതിക്കുന്ന ഭാഗം. ഇത് പിന്നീട് ഡിവിഡന്റായി വിഭജിക്കപ്പെടുന്നു.",
    descEn: "The difference between the total chit value and the amount the winner agrees to accept."
  },
  {
    id: "dividend",
    termMl: "ഡിവിഡന്റ്",
    termEn: "Dividend",
    descMl: "ലേലത്തിൽ കുറയ്ക്കുന്ന ഡിസ്കൗണ്ട് തുക ഫോർമാൻ കമ്മീഷന് ശേഷം മറ്റ് അംഗങ്ങൾക്ക് വീതിച്ചു നൽകുന്ന ലാഭം. ഇത് അടുത്ത മാസത്തെ അടവ് തുക കുറയ്ക്കാൻ സഹായിക്കുന്നു.",
    descEn: "The share of the auction discount distributed among subscribers to reduce their next monthly installment.",
    exampleMl: "ഡിസ്കൗണ്ടിൽ നിന്ന് ഫോർമാൻ കമ്മീഷൻ കുറച്ചുള്ള ബാക്കി തുകയെ ആകെ ചിട്ടി അംഗങ്ങളുടെ എണ്ണം കൊണ്ട് ഹരിച്ചാണ് ഇത് കണക്കാക്കുന്നത്.",
    exampleEn: "Remaining auction discount (after commission) divided equally among all members."
  },
  {
    id: "foreman",
    termMl: "ഫോർമാൻ",
    termEn: "Foreman",
    descMl: "ചിട്ടിയുടെ നടത്തിപ്പുകാരനാണ് ഫോർമാൻ (ഉദാ: കെ.എസ്.എഫ്.ഇ - KSFE). ചിട്ടി കാര്യക്ഷമമായി നടത്തുക, ജാമ്യം സ്വീകരിച്ചു പണം നൽകുക, തവണകൾ കൃത്യമായി പിരിക്കുക, ചിട്ടി വിജയകരമായി പൂർത്തിയാക്കാൻ ഗ്യാരണ്ടി നൽകുക എന്നിവയാണ് ഫോർമാന്റെ പ്രധാന ചുമതലകൾ.",
    descEn: "The organizer or institution registered to run, coordinate, and guarantee the chit fund."
  },
  {
    id: "foreman-commission",
    termMl: "ഫോർമാൻ കമ്മീഷൻ",
    termEn: "Foreman Commission",
    descMl: "ചിട്ടി നടത്തിപ്പിനായി ഫോർമാൻ ഈടാക്കുന്ന ഫീസ് (നിയമപരമായി സാധാരണ 5% വരെ). ഇത് ചിട്ടിയുടെ സുരക്ഷിതമായ നടത്തിപ്പിനും കമ്പനിയുടെ പ്രവർത്തന ചെലവുകൾക്കുമാണ്.",
    descEn: "The service charge collected by the foreman for managing the chit, typically up to 5% of the chit value.",
    exampleMl: "25 ലക്ഷം രൂപയുടെ ചിട്ടിയിൽ 5% ഫോർമാൻ കമ്മീഷൻ എന്നാൽ ₹1,25,000 ആണ്.",
    exampleEn: "In a ₹25 Lakh chit, a 5% commission equals ₹1,25,000."
  },
  {
    id: "chit-pool",
    termMl: "ചിട്ടി ഫണ്ട്",
    termEn: "Chit Fund Pool",
    descMl: "ചിട്ടിയിലെ എല്ലാ അംഗങ്ങളും ചേർന്ന് ഓരോ മാസവും അടയ്ക്കുന്ന ആകെ തുക.",
    descEn: "The total pooled money collected from all subscribers in a month."
  },
  {
    id: "bidder",
    termMl: "ബിഡ്ഡർ",
    termEn: "Bidder",
    descMl: "പ്രതിമാസ ലേലത്തിൽ പങ്കെടുത്തു ചിട്ടി തുകക്കായി ലേലം വിളിക്കുന്ന അംഗം.",
    descEn: "A subscriber who actively participates in the monthly auction to bid for the prize money."
  },
  {
    id: "security",
    termMl: "ജാമ്യം",
    termEn: "Security / Guarantor",
    descMl: "സമ്മാന തുക കൈപ്പറ്റുന്നതിന് മുൻപ് ബാക്കി തവണകൾ കൃത്യമായി അടയ്ക്കുമെന്ന് ഉറപ്പുനൽകാൻ സമർപ്പിക്കേണ്ട രേഖകൾ (സ്വർണം, വസ്തു പ്രമാണം, ശമ്പള സർട്ടിഫിക്കറ്റ് മുതലായവ).",
    descEn: "Collateral or guarantees (like gold, property deeds, or salary certificates) required before claiming the prize money.",
    exampleMl: "ബാധ്യതയില്ലാത്ത വസ്തു പ്രമാണങ്ങളോ അല്ലെങ്കിൽ സ്ഥിരം സർക്കാർ ജോലിയുള്ളവരുടെ ശമ്പള സർട്ടിഫിക്കറ്റുകളോ ഇതിനായി ഉപയോഗിക്കാം.",
    exampleEn: "Gold, land deeds, fixed deposits, or salary certificates of government employees."
  },
  {
    id: "arrears",
    termMl: "കുടിശ്ശിക",
    termEn: "Arrears",
    descMl: "ഒരു അംഗം കൃത്യസമയത്ത് അടയ്ക്കാതെ ബാക്കിവെച്ചിരിക്കുന്ന തവണ തുകകൾ.",
    descEn: "The unpaid installments or late dues owed by a subscriber."
  },
  {
    id: "penalty",
    termMl: "പിഴ",
    termEn: "Penalty",
    descMl: "തവണകൾ കൃത്യസമയത്ത് അടയ്ക്കാത്തതിന് ഈടാക്കുന്ന അധിക തുക.",
    descEn: "The additional charge imposed on subscribers for delayed installment payments."
  },
  {
    id: "payment",
    termMl: "പണമടയ്ക്കൽ",
    termEn: "Payment",
    descMl: "ചിട്ടിയിലേക്ക് പ്രതിമാസ തവണകളായി പണം നൽകുന്ന പ്രക്രിയ.",
    descEn: "The act of paying monthly installments to keep the chit subscription active."
  },
  {
    id: "auction-winner",
    termMl: "ലേലക്കാരൻ / ലേലവിജയി",
    termEn: "Auction Winner",
    descMl: "ലേലം വിളിച്ച് ഏറ്റവും കുറഞ്ഞ തുക കൈപ്പറ്റാൻ തയ്യറായി ആ മാസത്തെ ചിട്ടി സ്വന്തമാക്കിയ വ്യക്തി.",
    descEn: "The subscriber who wins the monthly auction by agreeing to the highest discount."
  },
  {
    id: "bid-limit",
    termMl: "ലേല പരിധി",
    termEn: "Bid Limit",
    descMl: "ഒരു ചിട്ടിയിൽ ലേലം വിളിക്കാവുന്ന പരമാവധി ഡിസ്കൗണ്ട് പരിധി (നിയമപ്രകാരം സാധാരണയായി ഇത് ചിട്ടി തുകയുടെ 30% മുതൽ 40% വരെയായി നിശ്ചയിച്ചിരിക്കുന്നു). ഇത് കസ്റ്റമർ ചൂഷണം തടയാൻ സഹായിക്കും.",
    descEn: "The maximum discount limit allowed in an auction, typically capped by regulations or rules (e.g., 30% to 40% of chit value).",
    exampleMl: "പരമാവധി ഡിസ്കൗണ്ട് പരിധി 30% ഉള്ള 25 ലക്ഷം രൂപയുടെ ചിട്ടിയിൽ ലേലത്തിൽ പോകാവുന്ന പരമാവധി കുറവ് ₹7,50,000 രൂപയാണ്.",
    exampleEn: "Under a 30% maximum discount cap, the discount cannot exceed ₹7,50,000 in a ₹25,00,000 chit."
  }
];

export const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    questionMl: "ചിട്ടി എന്താണ്?",
    questionEn: "What is a chit fund?",
    answerMl: "ഒരു കൂട്ടം ആളുകൾ ചേർന്ന് നിശ്ചിത തുക വീതം തവണകളായി അടയ്ക്കുകയും, ലേലം വഴിയോ നറുക്കെടുപ്പിലൂടെയോ ആ തുക ഒരുമിച്ച് ആവശ്യക്കാർക്ക് നൽകുകയും ചെയ്യുന്ന ഒരു സമ്പാദ്യ-വായ്പ പദ്ധതിയാണിത്. ഇത് സമ്പാദ്യ ശീലത്തോടൊപ്പം അടിയന്തര പണ ആവശ്യങ്ങൾക്ക് ഒരു വായ്പ പോലെ ഉപയോഗിക്കാനും സാധിക്കുന്നു.",
    answerEn: "A chit fund is a financial scheme where a group of individuals contribute a fixed amount periodically. This collected money is distributed to one of the members via auction or draw. It acts as both a savings tool and an emergency source of funding."
  },
  {
    id: "faq-2",
    questionMl: "ചിട്ടിയിൽ പലിശ ഉണ്ടോ?",
    questionEn: "Is there interest in a chit fund?",
    answerMl: "സാധാരണ വായ്പകൾ പോലെ ചിട്ടിയിൽ പരമ്പരാഗതമായ അർത്ഥത്തിൽ പലിശയില്ല. പകരം, ലേലം വിളിക്കുന്ന വ്യക്തി വിട്ടു നൽകുന്ന 'ഡിസ്കൗണ്ട്' ആണ് മറ്റ് അംഗങ്ങൾക്ക് ലാഭവിഹിതം (ഡിവിഡന്റ്) ആയി ലഭിക്കുന്നത്. ബാങ്ക് ലോൺ പലിശയേക്കാൾ കുറഞ്ഞ ചെലവിൽ വലിയ തുക കൈപ്പറ്റാൻ ഇത് സഹായിക്കുന്നു.",
    answerEn: "No, chit funds do not have traditional interest rates like banks. Instead, they operate on 'discounts' bid by subscribers. The foregone discount is shared among other members as dividend, making the overall cost of borrowing competitive compared to loans."
  },
  {
    id: "faq-3",
    questionMl: "ലേലം എങ്ങനെ നടക്കുന്നു?",
    questionEn: "How does the auction work?",
    answerMl: "ഓരോ മാസവും ചിട്ടി ഓഫീസിൽ വെച്ചു നിശ്ചിത സമയത്തു ലേലം നടക്കും. തുക ആവശ്യമുള്ള അംഗങ്ങൾ ലേലത്തിൽ പങ്കെടുത്തു എത്ര രൂപ വിട്ടുനൽകാൻ തയ്യാറാണെന്ന് അറിയിക്കും. ഏറ്റവും കൂടുതൽ തുക ഡിസ്കൗണ്ട് നൽകാൻ തയ്യാറാകുന്നയാൾക്ക് ആ മാസത്തെ ചിട്ടി ഉറപ്പിക്കും.",
    answerEn: "Every month, a bidding auction is conducted. Subscribers in need of funds compete by declaring the discount they are willing to accept. The bidder offering the highest discount wins the prize money for that round."
  },
  {
    id: "faq-4",
    questionMl: "ഡിവിഡന്റ് എന്നാൽ എന്താണ്?",
    questionEn: "What is dividend?",
    answerMl: "ലേലവിജയി വിട്ടുനൽകുന്ന ഡിസ്കൗണ്ട് തുകയിൽ നിന്ന് ഫോർമാൻ കമ്മീഷൻ കഴിച്ചുള്ള ബാക്കി തുക എല്ലാ അംഗങ്ങൾക്കും തുല്യമായി വീതിച്ചു നൽകുന്നതാണ് ഡിവിഡന്റ്. ഇത് ഓരോ മാസവും അംഗങ്ങൾ അടയ്ക്കേണ്ട തവണ തുകയിൽ കുറവു വരുത്തുന്നു.",
    answerEn: "Dividend is the share of the auction discount distributed equally to all subscribers after deducting the foreman commission. It directly lowers the subscription installment for the next month."
  },
  {
    id: "faq-5",
    questionMl: "ഫോർമാൻ ആരാണ്?",
    questionEn: "Who is the foreman?",
    answerMl: "ചിറ്റിയുടെ നടത്തിപ്പുകാരനാണ് ഫോർമാൻ (ഉദാ: കെ.എസ്.എഫ്.ഇ - KSFE). ചിട്ടി കാര്യക്ഷമമായി നടത്തുക, ജാമ്യം സ്വീകരിച്ചു പണം നൽകുക, തവണകൾ കൃത്യമായി പിരിക്കുക, ചിട്ടി വിജയകരമായി പൂർത്തിയാക്കാൻ ഗ്യാരണ്ടി നൽകുക എന്നിവയാണ് ഫോർമാന്റെ പ്രധാന ചുമതലകൾ.",
    answerEn: "The foreman is the institution or individual responsible for organizing and conducting the chit (e.g., KSFE). They manage collections, verify security documents, disburse funds, and guarantee the safety of the members' money."
  },
  {
    id: "faq-6",
    questionMl: "ചിട്ടി തുക മുഴുവൻ ഒരുമിച്ച് ലഭിക്കുമോ?",
    questionEn: "Do I receive the entire chit value?",
    answerMl: "ഇല്ല, ലേലം വിളിക്കാതെ അവസാനം വരെ കാത്തിരിക്കുന്ന അംഗത്തിന് പോലും ഫോർമാൻ കമ്മീഷൻ (സാധാരണയായി 5%) കുറച്ചുള്ള തുക മാത്രമേ ലഭിക്കുകയുള്ളൂ. അതിനു മുമ്പ് ലേലം വിളിച്ചെടുക്കുന്നവർക്ക് കമ്മീഷനോടൊപ്പം ലേല ഡിസ്കൗണ്ടും കഴിച്ച് ബാക്കി തുകയേ ലഭിക്കൂ.",
    answerEn: "No, you do not receive the gross chit value. Even if you wait until the last month without bidding, the foreman's management commission (typically 5%) is deducted. If you bid early, both the commission and your bid discount are deducted."
  },
  {
    id: "faq-7",
    questionMl: "ചിട്ടിയിൽ അംഗമാകുന്നതിന് മുമ്പ് എന്തൊക്കെ പരിശോധിക്കണം?",
    questionEn: "What should I check before joining a chit?",
    answerMl: "അംഗമാകുന്നതിന് മുൻപ് ചിട്ടിയുടെ മൊത്തം തുക, പ്രതിമാസ തവണ, കാലാവധി, പരമാവധി ലേല പരിധി, ഫോർമാൻ കമ്മീഷൻ, സമ്മാനത്തുക ലഭിക്കാൻ ആവശ്യമായ ജാമ്യ വ്യവസ്ഥകൾ, പണമടയ്ക്കാൻ വൈകിയാൽ ഉണ്ടാകുന്ന പിഴകൾ എന്നിവ വിശദമായി വായിച്ചു മനസ്സിലാക്കണം. ചിട്ടി കമ്പനി സർക്കാരിൽ രജിസ്റ്റർ ചെയ്തിട്ടുള്ളതാണെന്ന് ഉറപ്പുവരുത്തണം.",
    answerEn: "Before joining, check the total chit value, monthly installment, duration, foreman commission, maximum bid limits, security (collateral) requirements, late fees, exit rules, and ensure the chit company is officially registered under the Chits Funds Act."
  },
  {
    id: "faq-8",
    questionMl: "ചിട്ടിയിൽ പണമടയ്ക്കാതെ പോയാൽ എന്ത് സംഭവിക്കും?",
    questionEn: "What happens if I miss a payment?",
    answerMl: "തവണകൾ കൃത്യസമയത്ത് അടച്ചില്ലെങ്കിൽ വൈകിയ ദിവസങ്ങൾക്ക് പിഴപ്പലിശ ഈടാക്കാം. ചിട്ടി തുക മുൻപ് തന്നെ കൈപ്പറ്റിയ അംഗമാണെങ്കിൽ ജാമ്യക്കാരിൽ നിന്നോ വസ്തുവകകളിൽ നിന്നോ ബാക്കി തുക കണ്ടുകെട്ടാം. പണം കൈപ്പറ്റാത്ത ആളാണെങ്കിൽ ചിട്ടിയിൽ നിന്നും ഫോർമാന് നിങ്ങളെ ഒഴിവാക്കാൻ നിയമപരമായ അവകാശമുണ്ട്.",
    answerEn: "Missing payments results in late fees and interest penalties. If you already claimed the prize money, the foreman can initiate recovery from your guarantors or collateral. If you have not won yet, the foreman may terminate your subscription after notices."
  },
  {
    id: "faq-9",
    questionMl: "ചിട്ടിയിൽ നിന്ന് നേരത്തെ പുറത്തുകടക്കാൻ കഴിയുമോ?",
    questionEn: "Can I exit a chit early?",
    answerMl: "പണം കൈപ്പറ്റാത്ത ചിട്ടി അംഗത്തിന് മറ്റൊരാളെ പകരക്കാരനായി (Substitution) ചേർത്തുകൊണ്ട് പുറത്തുകടക്കാൻ സാധിക്കും. ഇത് നിങ്ങളുടെ മുൻകാല അടവുകൾ തിരികെ ലഭിക്കാൻ സഹായിക്കും. ചിട്ടി തീരുന്നതുവരെ പകരക്കാരനെ കണ്ടെത്തിയില്ലെങ്കിൽ നിയമാനുസൃതമായ പിഴയോട് കൂടി അവസാനമേ അടച്ച തുക തിരികെ ലഭിക്കൂ.",
    answerEn: "Yes, an unpaid member can exit by offering a substitute subscriber. This is called 'Chit Substitution'. If no substitute is provided, you may have to wait until the end of the chit period to receive your deposits after legal penalty deductions."
  }
];
