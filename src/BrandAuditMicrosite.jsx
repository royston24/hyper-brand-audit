import { useState } from "react";

/* ─── FORMSPREE ──────────────────────────────────────────────────────────────
   Two separate forms — one fires at the lead gate, one at quiz completion.
   Go to formspree.io → New Form for each → paste the IDs below.
────────────────────────────────────────────────────────────────────────────── */
const FS_LEAD    = "mkopgqlj"; // ← Form 1: "Brand Audit — Lead Capture"
const FS_RESULTS = "mwvwprdb"; // ← Form 2: "Brand Audit — Full Results"

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
   Headers (H1/display) → weight 200 (Thin)
   Sub-headers, labels  → weight 300 (Light)
   Body copy            → weight 500 (Medium) — for legibility at small sizes
   Score colours        → green ≥80 | orange 50–79 | red ≤49
   Section alternation  → #333031 (warm dark) | #ffffff (white)
────────────────────────────────────────────────────────────────────────────── */
const T = {
  bg:      "#0C0C0C",
  s1:      "#333031",   // warm-dark section bg
  s2:      "#ffffff",   // white section bg
  surface: "#141414",
  sur2:    "#1E1C1D",
  border:  "#2C2A2B",
  bord2:   "#3E3B3C",
  white:   "#FFFFFF",
  off:     "#F0EDE8",
  mid:     "#888888",
  dim:     "#555555",
  dimmer:  "#3A3A3A",
  F:       "'Pitagon Sans Mono', monospace",
  // score colours
  green:   "#22C55E",
  orange:  "#F97316",
  red:     "#EF4444",
  // priority accent
  pRed:    "#EF4444",
};

/* Typography helpers */
/* H1 / big display — Thin, uppercase */
const DISP = {
  fontFamily: T.F, fontWeight: 200,
  textTransform: "uppercase", letterSpacing: "0.04em",
};
/* Section sub-headings — Light, uppercase */
const SUBHEAD = {
  fontFamily: T.F, fontWeight: 300,
  textTransform: "uppercase", letterSpacing: "0.06em",
};
/* Small eyebrow labels — Medium, very wide tracking */
const LABEL = {
  fontFamily: T.F, fontWeight: 500,
  fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase",
};
/* Body copy — Medium (500) for legibility at small sizes */
const BODY = {
  fontFamily: T.F, fontWeight: 500,
  lineHeight: 1.8, fontSize: "1rem",
};

/* ── Context-aware text helpers (adapts to light/dark section bg) ── */
const isDark  = bg => bg !== "#ffffff" && bg !== "#FFFFFF";
const tx      = bg => isDark(bg) ? T.off   : "#111111";      // primary text
const txMid   = bg => isDark(bg) ? T.mid   : "#666666";      // secondary text
const txDim   = bg => isDark(bg) ? T.dim   : "#AAAAAA";      // dimmed text
const bord    = bg => isDark(bg) ? T.border: "#E0E0E0";      // border
const bord2x  = bg => isDark(bg) ? T.bord2 : "#CCCCCC";
const surfBg  = bg => isDark(bg) ? T.sur2  : "#F7F5F2";      // card/inset bg

/* ─── SCORE COLOUR ─────────────────────────────────────────────────────────── */
function getTier(s) {
  if (s >= 80) return { label: "Strong Brand",              hex: T.green  };
  if (s >= 50) return { label: "Developing Brand",          hex: T.orange };
  return             { label: "Needs Urgent Attention",     hex: T.red    };
}

/* ─── QUESTION DATA ─────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    id:"A", num:"01", label:"Brand Foundation",
    sub:"Core strategy, visual identity, and brand guidelines.",
    questions:[
      { id:"q1", type:"single",
        text:"Does your business have a documented brand mission or purpose statement?",
        opts:[
          {l:"Yes — clearly documented and actively referenced", s:2},
          {l:"Somewhat — exists informally, never written down", s:1},
          {l:"No — we haven't defined this yet", s:0},
        ]},
      { id:"q2", type:"single",
        text:"How clearly defined is your target audience?",
        opts:[
          {l:"Very specific — we know exactly who we serve", s:2},
          {l:"General — we have a broad idea of our customers", s:1},
          {l:"Undefined — we try to appeal to everyone", s:0},
        ]},
      { id:"q3", type:"single",
        text:"Does your brand have a clear USP — a compelling reason to choose you over competitors?",
        opts:[
          {l:"Yes — documented and consistently communicated", s:2},
          {l:"We have an idea but it isn't formally defined", s:1},
          {l:"No — we haven't established a clear USP", s:0},
        ]},
      { id:"q4", type:"single",
        text:"Do you have brand guidelines (logo rules, colour palette, typography) your team follows?",
        opts:[
          {l:"Yes — formal documented guidelines in active use", s:2},
          {l:"Informal — unwritten rules the team generally follows", s:1},
          {l:"No — no brand guidelines exist", s:0},
        ]},
      { id:"q5", type:"single",
        text:"How would you describe your brand's overall visual identity today?",
        opts:[
          {l:"Professional and consistent across all touchpoints", s:3},
          {l:"Mostly consistent with some noticeable gaps", s:2},
          {l:"Inconsistent — varies across materials and channels", s:1},
          {l:"We don't have a defined visual identity", s:0},
        ]},
    ],
  },
  {
    id:"B", num:"02", label:"Brand Marketing",
    sub:"Digital presence, content strategy, and market positioning.",
    questions:[
      { id:"q6", type:"single",
        text:"Does your website clearly explain what you do, who you serve, and what makes you different?",
        opts:[
          {l:"Yes — strong value proposition and clear CTA throughout", s:3},
          {l:"Partially — some information is clear but could be stronger", s:2},
          {l:"Not clearly — visitors would struggle to understand our offer", s:1},
          {l:"We don't have a website", s:0},
        ]},
      { id:"q7", type:"single",
        text:"Is your website mobile-friendly and kept up to date?",
        opts:[
          {l:"Yes — fully mobile-optimised and updated regularly", s:2},
          {l:"It works on mobile but the content needs updating", s:1},
          {l:"No / We don't have a website", s:0},
        ]},
      { id:"q8", type:"single",
        text:"Does your brand produce regular content to attract and engage your audience?",
        opts:[
          {l:"Yes — consistently, guided by a clear content strategy", s:3},
          {l:"Occasionally — when we have time or inspiration", s:2},
          {l:"Rarely — we've tried but it isn't consistent", s:1},
          {l:"No — we don't produce content", s:0},
        ]},
      { id:"q9", type:"single",
        text:"How would you describe your current marketing activity overall?",
        opts:[
          {l:"Active — clear strategy with regular campaigns", s:3},
          {l:"Some activity — but no clear strategy guiding it", s:2},
          {l:"Very minimal — only when absolutely necessary", s:1},
          {l:"None — we rely entirely on word of mouth", s:0},
        ]},
      { id:"q10", type:"single",
        text:"Do you know who your top competitors are and how they position themselves?",
        opts:[
          {l:"Yes — we monitor them regularly", s:2},
          {l:"Somewhat — aware of them but don't track them closely", s:1},
          {l:"Not really — we focus only on our own business", s:0},
        ]},
      { id:"q11", type:"single",
        text:"Do you have customer testimonials, case studies, or reviews actively used in your marketing?",
        opts:[
          {l:"Yes — prominently featured across our channels", s:2},
          {l:"A few exist — but underused in our marketing", s:1},
          {l:"No — we don't have these in place yet", s:0},
        ]},
    ],
  },
  {
    id:"C", num:"03", label:"Social Media",
    sub:"Platform presence, consistency, and performance.",
    questions:[
      { id:"q12", type:"multi",
        text:"Which social media platforms is your brand currently active on?",
        opts:[
          {l:"Instagram"},{l:"Facebook"},{l:"LinkedIn"},
          {l:"TikTok"},{l:"YouTube"},{l:"X (Twitter)"},
          {l:"None — we're not on social media"},
        ]},
      { id:"q13", type:"single",
        text:"How frequently does your brand post on social media?",
        opts:[
          {l:"Daily or almost daily", s:5},
          {l:"3–5 times per week", s:4},
          {l:"1–2 times per week", s:3},
          {l:"A few times a month", s:2},
          {l:"Rarely — we post sporadically", s:1},
          {l:"Never / Not on social media", s:0},
        ]},
      { id:"q14", type:"single",
        text:"Is your brand's visual style consistent across all social media platforms?",
        opts:[
          {l:"Yes — very consistent and immediately recognisable", s:3},
          {l:"Mostly — but there are some inconsistencies", s:2},
          {l:"Not really — it varies quite a bit", s:1},
          {l:"No — there's no visual consistency at all", s:0},
        ]},
      { id:"q15", type:"single",
        text:"Do you have a documented content strategy or content calendar?",
        opts:[
          {l:"Yes — documented and actively followed", s:2},
          {l:"Informal — a general plan but nothing formal", s:1},
          {l:"No — we post reactively with no plan", s:0},
        ]},
      { id:"q16", type:"single",
        text:"How would you describe your engagement with your audience on social media?",
        opts:[
          {l:"Very active — we reply to all comments and DMs promptly", s:3},
          {l:"Moderate — we engage occasionally but not consistently", s:2},
          {l:"Low — we mostly post and rarely engage back", s:1},
          {l:"No engagement at all", s:0},
        ]},
      { id:"q17", type:"single",
        text:"Does your social media activity generate measurable business results?",
        opts:[
          {l:"Yes — clear and consistent results we can track", s:3},
          {l:"Some results — but difficult to measure accurately", s:2},
          {l:"Unsure — we haven't tracked this", s:1},
          {l:"No measurable results", s:0},
        ]},
    ],
  },
  {
    id:"D", num:"04", label:"Brand Perception",
    sub:"The gap between how you see your brand and how the market sees it.",
    questions:[
      { id:"q18", type:"text",
        text:"In 3 words, how do you WANT your target customers to describe your brand?",
        placeholder:"e.g. Trustworthy, Premium, Innovative"},
      { id:"q19", type:"text",
        text:"Based on feedback received, how do customers CURRENTLY describe your brand?",
        placeholder:"e.g. Friendly, Affordable, Reliable"},
      { id:"q20", type:"multi",
        text:"What is your brand's biggest challenge right now? (Select all that apply)",
        opts:[
          {l:"Lack of brand awareness in the market"},
          {l:"Inconsistent brand image across channels"},
          {l:"Not attracting the right customers"},
          {l:"Weak or non-existent social media presence"},
          {l:"No clear differentiation from competitors"},
          {l:"Outdated or unclear brand identity"},
          {l:"No clear brand strategy or direction"},
        ]},
    ],
  },
];

const INDUSTRIES = [
  "F&B / Restaurant","Retail","Fashion & Lifestyle","Beauty & Wellness",
  "Tech & Software","Professional Services","Education","Real Estate & Interior",
  "Healthcare","Events & Entertainment","E-commerce","Non-Profit / Social Enterprise","Other",
];

/* ─── SCORING ───────────────────────────────────────────────────────────────── */
function calcScores(ans) {
  const g = id => ans[id]?.s ?? 0;
  const aRaw=["q1","q2","q3","q4","q5"].reduce((t,id)=>t+g(id),0);
  const bRaw=["q6","q7","q8","q9","q10","q11"].reduce((t,id)=>t+g(id),0);
  const cRaw=["q13","q14","q15","q16","q17"].reduce((t,id)=>t+g(id),0);
  const aMax=11, bMax=15, cMax=16;
  const aP=Math.round((aRaw/aMax)*100);
  const bP=Math.round((bRaw/bMax)*100);
  const cP=Math.round((cRaw/cMax)*100);
  return { aRaw,aMax,bRaw,bMax,cRaw,cMax,aP,bP,cP, overall:Math.round((aP+bP+cP)/3) };
}

function getFindings(ans, biz) {
  const items=[];
  const push=(text,type="gap")=>items.push({type,text});
  if((ans.q1?.s??0)===2) push(`${biz||"Your brand"} has a documented mission — a foundation most growing businesses lack.`,"strength");
  if((ans.q4?.s??0)===2) push("Formal brand guidelines are in place — a significant advantage in maintaining consistency across all touchpoints.","strength");
  if((ans.q5?.s??0)>=2)  push("A consistent visual identity is already working in your favour.","strength");
  if((ans.q11?.s??0)===2)push("Customer testimonials are actively deployed — strong credibility signal in the market.","strength");
  if((ans.q1?.s??0)===0) push("No documented brand mission. Without a clear purpose every brand decision becomes harder and your story becomes harder to tell.");
  if((ans.q4?.s??0)===0) push("No brand guidelines exist. Every designer and vendor will interpret your brand independently — the most common driver of inconsistency.");
  if((ans.q5?.s??0)<=1)  push("Your visual identity is inconsistent or undefined, signalling a lack of professionalism before a customer has even engaged.");
  if((ans.q6?.s??0)<=1)  push("Your website doesn't clearly communicate your value proposition. Visitors who can't understand your offer within 5 seconds are already gone.");
  if((ans.q8?.s??0)===0) push("No content is being produced. Brands that don't create content are invisible — competitors are building authority with every piece they publish.");
  if((ans.q11?.s??0)===0)push("No testimonials or case studies in use. Social proof is one of the highest-converting tools available — and it costs almost nothing to collect.");
  if((ans.q13?.s??0)<=1) push("Social media posting is very infrequent, severely limiting your organic reach and signalling inactivity to potential clients.");
  if((ans.q17?.s??0)===0)push("Social media is generating no measurable results — a clear disconnect between content output and business goals.");
  return items.slice(0,5);
}

function getRecs(ans, sc) {
  const recs=[];
  if(sc.aP<60) recs.push({p:"Priority",t:"Build Your Brand Foundation",d:"A brand strategy session to define your mission, USP, and brand guidelines is the non-negotiable starting point. Everything else will underperform without it."});
  if(sc.bP<60) recs.push({p:"Priority",t:"Strengthen Your Digital Presence",d:"Rewrite your website's value proposition, add customer testimonials, and build a 30-day content calendar. These three moves can meaningfully shift how potential clients perceive you."});
  if(sc.cP<60) recs.push({p:"Priority",t:"Build a Social Media System",d:"Define 3–4 content pillars aligned to your brand positioning. Strategy before volume — it's not about posting more, it's about posting with purpose."});
  if((ans.q11?.s??0)===0) recs.push({p:"Quick Win",t:"Collect Testimonials This Week",d:"Reach out to your 5 best clients today. One strong, specific testimonial deployed across your channels can immediately improve credibility and conversion."});
  if((ans.q6?.s??0)<=1)  recs.push({p:"Quick Win",t:"Rewrite Your Website Headline",d:"Answer three questions above the fold: What do you do? Who for? Why you? A compelling headline with a clear CTA is the single highest-ROI website fix."});
  if(sc.overall>=70) recs.push({p:"Growth",t:"Amplify What's Already Working",d:"Your foundations are solid. Sharpen your positioning, invest in content quality, and consider targeted distribution to scale what's already resonating."});
  return recs.slice(0,3);
}

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Pitagon+Sans+Mono:wght@100;200;300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0C0C0C; }
  ::selection { background: rgba(255,255,255,0.12); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0C0C0C; }
  ::-webkit-scrollbar-thumb { background: #333031; }
  input, select, textarea, button { font-family: 'Pitagon Sans Mono', monospace !important; }
  @media print {
    @page { margin: 16mm 14mm; size: A4; }
    body { background: #fff !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .no-print { display: none !important; }
  }
`;

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────────── */

/* Nav icon mark — kept for quiz progress bar */
const IconMark = ({ bg }) => (
  <div style={{ width:"20px", height:"20px", border:`1px solid ${isDark(bg)?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.15)"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
    <div style={{ width:"6px", height:"6px", background:isDark(bg)?T.white:"#111", borderRadius:"50%" }}/>
  </div>
);

/* Score ring arc — coloured by tier */
function ScoreArc({ score, size=130 }) {
  const r=48, cx=size/2, cy=size/2, circ=2*Math.PI*r;
  const offset = circ-(circ*score)/100;
  const tier = getTier(score);
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={tier.hex} strokeWidth="6"
          strokeLinecap="butt" strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition:"stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ ...DISP, fontSize:"1.8rem", color:tier.hex, letterSpacing:"-0.02em" }}>{score}</span>
        <span style={{ ...LABEL, fontSize:"0.5rem", color:T.mid, marginTop:"3px" }}>/ 100</span>
      </div>
    </div>
  );
}

/* Pillar bar — coloured by tier, adapts to bg */
function PillarBar({ label, pct, pts, maxPts, bg }) {
  const tier = getTier(pct);
  return (
    <div style={{ paddingBottom:"20px", marginBottom:"20px", borderBottom:`1px solid ${bord(bg)}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"10px" }}>
        <span style={{ ...LABEL, color:txMid(bg) }}>{label}</span>
        <div style={{ display:"flex", alignItems:"baseline", gap:"8px" }}>
          <span style={{ ...DISP, fontSize:"1.4rem", color:tier.hex, letterSpacing:"-0.02em" }}>{pct}</span>
          <span style={{ ...LABEL, color:txDim(bg) }}>{pts}/{maxPts} pts</span>
        </div>
      </div>
      <div style={{ height:"2px", background:isDark(bg)?"rgba(255,255,255,0.08)":"#E8E8E8" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:tier.hex, transition:"width 1.4s cubic-bezier(0.4,0,0.2,1)" }}/>
      </div>
    </div>
  );
}

/* Option row — adapts to bg */
function OptionRow({ label, selected, onClick, type="radio", bg=T.bg }) {
  const selBg = isDark(bg) ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const indBorder = isDark(bg)
    ? (selected ? T.white : T.dim)
    : (selected ? "#111"  : "#AAAAAA");
  const indBg = isDark(bg)
    ? (selected ? T.white : "transparent")
    : (selected ? "#111"  : "transparent");
  const dotBg = isDark(bg) ? T.bg : T.white;

  return (
    <div onClick={onClick} style={{
      display:"flex", alignItems:"flex-start", gap:"18px",
      padding:"15px 20px", cursor:"pointer",
      borderBottom:`1px solid ${bord(bg)}`,
      background: selected ? selBg : "transparent",
      transition:"background 0.1s ease",
    }}>
      <div style={{
        width:"14px", height:"14px", flexShrink:0, marginTop:"3px",
        border:`1px solid ${indBorder}`,
        borderRadius: type==="multi" ? "2px" : "50%",
        background: indBg,
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.1s ease",
      }}>
        {selected && <div style={{ width: type==="multi"?"7px":"5px", height:type==="multi"?"7px":"5px", background:dotBg, borderRadius:type==="multi"?"1px":"50%" }}/>}
      </div>
      <span style={{ ...BODY, fontSize:"0.8rem", color: selected ? tx(bg) : txMid(bg) }}>
        {label}
      </span>
    </div>
  );
}

/* Text input field — adapts to bg */
function Field({ label, value, onChange, type="text", placeholder="", error="", bg=T.bg }) {
  return (
    <div style={{ marginBottom:"24px" }}>
      <label style={{ ...LABEL, color:error ? (isDark(bg)?T.off:"#111") : txMid(bg), display:"block", marginBottom:"8px" }}>
        {label}{error ? <span style={{ marginLeft:"8px" }}>— {error}</span> : ""}
      </label>
      <input type={type} value={value} placeholder={placeholder}
        onChange={e=>onChange(e.target.value)}
        style={{
          ...BODY, fontSize:"0.82rem", width:"100%",
          background:"transparent",
          border:"none", borderBottom:`1px solid ${error ? (isDark(bg)?T.off:"#111") : bord(bg)}`,
          padding:"10px 0", color:tx(bg), outline:"none",
          transition:"border-color 0.15s",
        }}
        onFocus={e=>e.target.style.borderBottomColor=isDark(bg)?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.4)"}
        onBlur={e=>e.target.style.borderBottomColor=error?(isDark(bg)?T.off:"#111"):bord(bg)}
      />
    </div>
  );
}

/* Primary CTA button */
function Btn({ children, onClick, bg=T.bg, outline=false, style={} }) {
  const btnBg   = outline ? "transparent" : (isDark(bg) ? T.white  : "#111");
  const btnColor= outline ? (isDark(bg)?T.off:"#111") : (isDark(bg) ? T.bg : T.white);
  const btnBord = `1px solid ${isDark(bg)?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.2)"}`;
  return (
    <button onClick={onClick} style={{
      ...DISP, fontSize:"0.7rem", letterSpacing:"0.1em",
      padding:"14px 32px",
      background:btnBg, color:btnColor,
      border: outline ? btnBord : "none",
      cursor:"pointer", transition:"opacity 0.15s", ...style,
    }}
    onMouseOver={e=>e.currentTarget.style.opacity="0.82"}
    onMouseOut={e=>e.currentTarget.style.opacity="1"}>
      {children}
    </button>
  );
}

/* Section header row (label + rule + counter) */
function SecHeader({ num, total, label, sub, bg }) {
  return (
    <div style={{ marginBottom:"48px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"28px" }}>
        <span style={{ ...LABEL, color:txDim(bg) }}>{num}</span>
        <div style={{ flex:1, height:"1px", background:bord(bg) }}/>
        <span style={{ ...LABEL, color:txDim(bg) }}>Section {num} of {total}</span>
      </div>
      {/* H1-style display heading — thin */}
      <div style={{ ...DISP, fontSize:"clamp(1.6rem,4vw,2.8rem)", color:tx(bg), marginBottom:"10px" }}>{label}</div>
      <div style={{ width:"1px", height:"22px", background:isDark(bg)?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.12)", margin:"14px 0" }}/>
      {/* Body copy — regular weight */}
      <p style={{ ...BODY, fontSize:"0.8rem", color:txMid(bg) }}>{sub}</p>
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────────── */
export default function BrandAudit() {
  const [screen,  setScreen]   = useState("intro");
  const [lead,    setLead]     = useState({ name:"", business:"", email:"", industry:"" });
  const [errs,    setErrs]     = useState({});
  const [answers, setAnswers]  = useState({});
  const [secIdx,  setSecIdx]   = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  /* ── 1. Lead gate submission ─────────────────────────────────────────────
     Fires immediately when "Start the Brand Audit" is clicked.
     Sends contact details only — ensures we have the lead even if they
     never complete the questionnaire.
  ────────────────────────────────────────────────────────────────────────── */
  const submitLead = async (leadData) => {
    try {
      await fetch(`https://formspree.io/f/${FS_LEAD}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject:    `Brand Audit — New Lead: ${leadData.business}`,
          name:        leadData.name,
          email:       leadData.email,
          business:    leadData.business,
          industry:    leadData.industry || "Not specified",
          started_at:  new Date().toLocaleString("en-SG", { timeZone:"Asia/Singapore" }),
          status:      "Questionnaire started — awaiting completion",
        }),
      });
    } catch {
      // Silent — lead capture failure should never block the user
    }
  };

  /* ── 2. Full results submission ──────────────────────────────────────────
     Fires when the user completes the final section and clicks "View Results".
     Sends all scores, answers, findings, and recommendations.
  ────────────────────────────────────────────────────────────────────────── */
  const submitResults = async (currentAnswers) => {
    const scores    = calcScores(currentAnswers);
    const tierLabel = getTier(scores.overall).label;
    const platforms = (currentAnswers.q12 || []).map(o => o.l).join(", ") || "Not specified";
    const challenges= (currentAnswers.q20 || []).map(o => o.l).join("; ") || "None selected";

    const payload = {
      _subject: `Brand Audit — Results: ${lead.business} (${scores.overall}/100 · ${tierLabel})`,

      // ── Lead details (repeated for easy cross-reference)
      name:             lead.name,
      email:            lead.email,
      business:         lead.business,
      industry:         lead.industry || "Not specified",
      completed_at:     new Date().toLocaleString("en-SG", { timeZone:"Asia/Singapore" }),

      // ── Scores
      overall_score:    `${scores.overall} / 100`,
      brand_tier:       tierLabel,
      score_brand_foundation: `${scores.aP}% (${scores.aRaw}/${scores.aMax} pts)`,
      score_brand_marketing:  `${scores.bP}% (${scores.bRaw}/${scores.bMax} pts)`,
      score_social_media:     `${scores.cP}% (${scores.cRaw}/${scores.cMax} pts)`,

      // ── Open-ended perception answers
      intended_perception: currentAnswers.q18?.l || "Not answered",
      current_perception:  currentAnswers.q19?.l || "Not answered",

      // ── Multi-select answers
      active_platforms: platforms,
      top_challenges:   challenges,

      // ── Full answer trail
      brand_mission:        currentAnswers.q1?.l  || "—",
      target_audience:      currentAnswers.q2?.l  || "—",
      has_usp:              currentAnswers.q3?.l  || "—",
      brand_guidelines:     currentAnswers.q4?.l  || "—",
      visual_identity:      currentAnswers.q5?.l  || "—",
      website_clarity:      currentAnswers.q6?.l  || "—",
      website_mobile:       currentAnswers.q7?.l  || "—",
      content_production:   currentAnswers.q8?.l  || "—",
      marketing_activity:   currentAnswers.q9?.l  || "—",
      competitor_awareness: currentAnswers.q10?.l || "—",
      social_proof:         currentAnswers.q11?.l || "—",
      posting_frequency:    currentAnswers.q13?.l || "—",
      visual_consistency:   currentAnswers.q14?.l || "—",
      content_strategy:     currentAnswers.q15?.l || "—",
      audience_engagement:  currentAnswers.q16?.l || "—",
      social_results:       currentAnswers.q17?.l || "—",
    };

    try {
      setSubmitting(true);
      const res = await fetch(`https://formspree.io/f/${FS_RESULTS}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) setSubmitError(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const setSingle   = (id,opt) => setAnswers(p=>({...p,[id]:opt}));
  const setText     = (id,val) => setAnswers(p=>({...p,[id]:{l:val,s:0}}));
  const toggleMulti = (id,opt) => setAnswers(p=>{
    const cur=p[id]||[], ex=cur.some(o=>o.l===opt.l);
    return {...p,[id]:ex?cur.filter(o=>o.l!==opt.l):[...cur,opt]};
  });

  const secDone  = i => SECTIONS[i].questions.filter(q=>q.type==="single").every(q=>answers[q.id]!==undefined);
  const totalQ   = SECTIONS.reduce((t,s)=>t+s.questions.filter(q=>q.type==="single").length,0);
  const doneQ    = Object.keys(answers).filter(id=>SECTIONS.some(s=>s.questions.find(q=>q.id===id&&q.type==="single"))).length;
  const progress = Math.round((doneQ/totalQ)*100);

  const validate = () => {
    const e={};
    if(!lead.name.trim())    e.name="required";
    if(!lead.business.trim())e.business="required";
    if(!lead.email.trim())   e.email="required";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) e.email="invalid";
    return e;
  };

  const sc       = calcScores(answers);
  const tier     = getTier(sc.overall);
  const findings = getFindings(answers, lead.business);
  const recs     = getRecs(answers, sc);

  /* ══════════════════════════════════════════════════════════════════════════
     PRINT REPORT — white paper with score colours
  ══════════════════════════════════════════════════════════════════════════ */
  if (showReport) {
    const wantDesc=answers.q18?.l||"—";
    const haveDesc=answers.q19?.l||"—";
    const percGap=wantDesc!=="—"&&haveDesc!=="—"&&wantDesc!==haveDesc;
    const RF=T.F;
    const rDisp = { fontFamily:RF, fontWeight:200, textTransform:"uppercase", letterSpacing:"0.04em" };
    const rLabel = { fontFamily:RF, fontWeight:500, fontSize:"0.56rem", letterSpacing:"0.16em", textTransform:"uppercase" };
    const rBody  = { fontFamily:RF, fontWeight:500, fontSize:"0.74rem", lineHeight:1.75 };

    return (
      <>
        <style>{css}</style>
        <div style={{ fontFamily:RF, background:"#fff", color:"#111", maxWidth:"820px", margin:"0 auto", padding:"0 32px 60px" }}>
          {/* Nav */}
          <div className="no-print" style={{ display:"flex", justifyContent:"space-between", padding:"22px 0 28px", borderBottom:"1px solid #E8E8E8", marginBottom:"40px" }}>
            <button onClick={()=>setShowReport(false)} style={{ fontFamily:RF, fontWeight:500, fontSize:"0.7rem", background:"none", border:"1px solid #DDD", padding:"8px 16px", cursor:"pointer", color:"#666" }}>← Back to Results</button>
            <button onClick={()=>window.print()} style={{ fontFamily:RF, fontWeight:500, fontSize:"0.7rem", background:"#111", color:"#fff", border:"none", padding:"8px 22px", cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase" }}>Print / Save PDF</button>
          </div>

          {/* Report header */}
          <div style={{ borderBottom:"2px solid #111", paddingBottom:"32px", marginBottom:"36px" }}>
            <div style={{ ...rLabel, color:"#AAA", marginBottom:"14px" }}>Hyper Creatives · Brand Audit Report</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"20px", flexWrap:"wrap" }}>
              <div>
                <div style={{ ...rDisp, fontSize:"2rem", color:"#111", lineHeight:1, marginBottom:"10px" }}>{lead.business||"Brand Audit"}</div>
                <div style={{ ...rBody, color:"#888" }}>Prepared for {lead.name} · {new Date().toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"})}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                {/* Big score in tier colour */}
                <div style={{ ...rDisp, fontSize:"3.5rem", color:tier.hex, lineHeight:1 }}>{sc.overall}</div>
                <div style={{ ...rLabel, color:"#AAA", marginTop:"4px" }}>/ 100</div>
                <div style={{ ...rLabel, color:tier.hex, marginTop:"6px", border:`1px solid ${tier.hex}`, display:"inline-block", padding:"3px 10px" }}>{tier.label}</div>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div style={{ marginBottom:"36px" }}>
            <div style={{ ...rLabel, color:"#AAA", marginBottom:"20px" }}>Score Breakdown</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1px", background:"#E8E8E8" }}>
              {[{l:"Brand Foundation",p:sc.aP,r:sc.aRaw,m:sc.aMax},
                {l:"Brand Marketing",p:sc.bP,r:sc.bRaw,m:sc.bMax},
                {l:"Social Media",p:sc.cP,r:sc.cRaw,m:sc.cMax}].map(({l,p,r,m})=>{
                const t=getTier(p);
                return (
                  <div key={l} style={{ padding:"20px 22px", background:"#fff" }}>
                    <div style={{ ...rLabel, color:"#AAA", marginBottom:"10px" }}>{l}</div>
                    {/* Score number in tier colour */}
                    <div style={{ ...rDisp, fontSize:"2.2rem", color:t.hex, lineHeight:1, marginBottom:"4px" }}>{p}<span style={{ fontSize:"0.9rem", fontWeight:500 }}>%</span></div>
                    <div style={{ ...rLabel, color:"#CCC", marginBottom:"12px" }}>{r} of {m} pts</div>
                    <div style={{ height:"2px", background:"#F0F0F0" }}>
                      <div style={{ height:"100%", width:`${p}%`, background:t.hex }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Findings */}
          <div style={{ marginBottom:"36px" }}>
            <div style={{ ...rLabel, color:"#AAA", marginBottom:"20px" }}>Key Findings</div>
            {findings.map((f,i)=>(
              <div key={i} style={{ display:"flex", gap:"16px", padding:"14px 18px", marginBottom:"2px",
                background:f.type==="strength"?"#F8F8F8":"#FFF",
                borderLeft:`2px solid ${f.type==="strength"?"#333":"#111"}` }}>
                <span style={{ fontFamily:RF, fontSize:"0.72rem", color:f.type==="strength"?"#666":"#111", fontWeight:500, flexShrink:0 }}>{f.type==="strength"?"✓":"—"}</span>
                <span style={{ ...rBody, color:"#444" }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Recommendations — Priority in red */}
          <div style={{ marginBottom:"36px" }}>
            <div style={{ ...rLabel, color:"#AAA", marginBottom:"20px" }}>Priority Recommendations</div>
            {recs.map((r,i)=>{
              const isPri = r.p==="Priority";
              return (
                <div key={i} style={{ padding:"20px 22px", border:"1px solid #E8E8E8", marginBottom:"2px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"10px" }}>
                    {/* Number — red if Priority */}
                    <span style={{ ...rLabel, color: isPri ? T.pRed : "#BBB" }}>0{i+1}</span>
                    {/* Label badge — red border + text if Priority */}
                    <span style={{
                      ...rLabel,
                      padding:"2px 8px",
                      border:`1px solid ${isPri ? T.pRed : "#DDD"}`,
                      color: isPri ? T.pRed : "#999",
                    }}>{r.p}</span>
                    <span style={{ fontFamily:RF, fontSize:"0.82rem", fontWeight:600, color:"#111" }}>{r.t}</span>
                  </div>
                  <p style={{ ...rBody, color:"#666", margin:0 }}>{r.d}</p>
                </div>
              );
            })}
          </div>

          {/* Perception */}
          {(answers.q18||answers.q19)&&(
            <div style={{ marginBottom:"36px" }}>
              <div style={{ ...rLabel, color:"#AAA", marginBottom:"20px" }}>Brand Perception Analysis</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px", marginBottom:percGap?"14px":"0" }}>
                {[{l:"Intended Perception",v:wantDesc,bg:"#F8F8F8"},{l:"Current Reality",v:haveDesc,bg:"#FFF"}].map(({l,v,bg})=>(
                  <div key={l} style={{ padding:"20px 22px", background:bg, border:"1px solid #E8E8E8" }}>
                    <div style={{ ...rLabel, color:"#CCC", marginBottom:"10px" }}>{l}</div>
                    <div style={{ fontFamily:RF, fontWeight:500, fontSize:"0.9rem", color:"#111" }}>{v}</div>
                  </div>
                ))}
              </div>
              {percGap&&<div style={{ padding:"14px 18px", background:"#F5F5F5", borderLeft:"2px solid #111" }}>
                <span style={{ ...rBody, color:"#555" }}>A meaningful gap exists between intended and current perception. Closing this gap is a high-impact brand priority.</span>
              </div>}
            </div>
          )}

          {/* CTA */}
          <div style={{ background:"#111", padding:"36px", textAlign:"center" }}>
            <div style={{ ...rLabel, color:"rgba(255,255,255,0.3)", marginBottom:"14px" }}>What's Next</div>
            <div style={{ ...rDisp, fontSize:"1.5rem", color:"#fff", marginBottom:"10px" }}>Let's close the gap together</div>
            <div style={{ ...rBody, color:"rgba(255,255,255,0.45)", marginBottom:"12px" }}>Book a complimentary Brand Discovery Call with Hyper Creatives.</div>
            <div style={{ ...rLabel, color:"rgba(255,255,255,0.4)" }}>www.hypercreatives.agency</div>
          </div>

          <div style={{ marginTop:"24px", paddingTop:"16px", borderTop:"1px solid #E8E8E8", display:"flex", justifyContent:"space-between" }}>
            <span style={{ ...rBody, color:"#CCC", fontSize:"0.6rem" }}>© 2026 Hyper Creatives · Singapore</span>
            <span style={{ ...rBody, color:"#CCC", fontSize:"0.6rem" }}>Confidential · {lead.name}</span>
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     INTRO SCREEN  — dark #0C0C0C | section ticker in #333031
  ══════════════════════════════════════════════════════════════════════════ */
  if (screen==="intro") {
    const heroBg = T.bg;
    const tickBg = T.s1;
    return (
      <>
        <style>{css}</style>
        <div style={{ fontFamily:T.F, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

          {/* Hero */}
          <div style={{ flex:1, background:heroBg, display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 48px 64px", maxWidth:"980px", margin:"0 auto", width:"100%" }}>
            <div style={{ ...LABEL, color:txDim(heroBg), marginBottom:"32px" }}>Free Brand Health Check</div>

            {/* H1 — thin uppercase, large */}
            <div style={{ ...DISP, fontSize:"clamp(2.8rem,7vw,5.2rem)", lineHeight:0.95, color:tx(heroBg), marginBottom:"4px" }}>Is your brand</div>
            <div style={{ ...DISP, fontSize:"clamp(2.8rem,7vw,5.2rem)", lineHeight:0.95, color:"rgba(255,255,255,0.3)", marginBottom:"4px" }}>&amp; everything</div>
            <div style={{ ...DISP, fontSize:"clamp(2.8rem,7vw,5.2rem)", lineHeight:0.95, color:tx(heroBg) }}>working for you?</div>

            <div style={{ width:"1px", height:"48px", background:"rgba(255,255,255,0.12)", margin:"40px 0" }}/>

            {/* Body — Regular weight */}
            <p style={{ ...BODY, fontSize:"0.88rem", color:txMid(heroBg), maxWidth:"520px", marginBottom:"52px" }}>
              Answer 20 focused questions about your brand, marketing, and social media presence. Receive an instant score, personalised findings, and clear next steps — in under 5 minutes.
            </p>

            <div style={{ display:"flex", alignItems:"center", gap:"32px", flexWrap:"wrap" }}>
              <Btn bg={heroBg} onClick={()=>setScreen("lead")}>Start Your Free Audit</Btn>
              <span style={{ ...LABEL, color:txDim(heroBg) }}>5 minutes · 20 questions</span>
            </div>
          </div>

          {/* Section ticker — warm dark #333031 */}
          <div style={{ background:tickBg, borderTop:`1px solid ${bord(tickBg)}`, display:"flex", overflowX:"auto" }}>
            {SECTIONS.map((s,i)=>(
              <div key={s.id} style={{ flex:"1 1 140px", padding:"20px 28px", borderRight:i<3?`1px solid ${bord(tickBg)}`:"none" }}>
                <div style={{ ...LABEL, color:txDim(tickBg), marginBottom:"6px" }}>{s.num}</div>
                <div style={{ ...LABEL, color:txMid(tickBg), letterSpacing:"0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     LEAD CAPTURE — white #ffffff background
  ══════════════════════════════════════════════════════════════════════════ */
  if (screen==="lead") {
    const bg = T.s2; // white
    return (
      <>
        <style>{css}</style>
        <div style={{ fontFamily:T.F, background:bg, minHeight:"100vh" }}>
          <div style={{ maxWidth:"580px", margin:"0 auto", padding:"72px 32px 80px" }}>

            <div style={{ ...LABEL, color:txDim(bg), marginBottom:"24px" }}>Before we begin</div>

            {/* H1 — thin */}
            <div style={{ ...DISP, fontSize:"clamp(2rem,5vw,3.2rem)", lineHeight:1, color:tx(bg), marginBottom:"4px" }}>Tell us</div>
            <div style={{ ...DISP, fontSize:"clamp(2rem,5vw,3.2rem)", lineHeight:1, color:"rgba(0,0,0,0.25)" }}>about you.</div>

            <div style={{ width:"1px", height:"32px", background:"rgba(0,0,0,0.1)", margin:"24px 0 28px" }}/>

            {/* Body — Regular */}
            <p style={{ ...BODY, fontSize:"0.82rem", color:txMid(bg), marginBottom:"48px" }}>
              Your personalised report will be ready at the end. We'll also follow up with expert commentary on your specific results.
            </p>

            <div style={{ borderTop:`1px solid ${bord(bg)}`, paddingTop:"40px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
                <Field label="Your Name"     value={lead.name}     onChange={v=>setLead(p=>({...p,name:v}))}     placeholder="Name"     error={errs.name}    bg={bg}/>
                <Field label="Business Name" value={lead.business} onChange={v=>setLead(p=>({...p,business:v}))} placeholder="Business" error={errs.business} bg={bg}/>
              </div>
              <Field label="Email Address" value={lead.email} type="email" onChange={v=>setLead(p=>({...p,email:v}))} placeholder="you@yourbusiness.com" error={errs.email} bg={bg}/>

              <div style={{ marginBottom:"44px" }}>
                <label style={{ ...LABEL, color:txMid(bg), display:"block", marginBottom:"8px" }}>Industry (Optional)</label>
                <select value={lead.industry} onChange={e=>setLead(p=>({...p,industry:e.target.value}))}
                  style={{ ...BODY, fontSize:"0.82rem", width:"100%", background:"transparent", border:"none", borderBottom:`1px solid ${bord(bg)}`, padding:"10px 0", color:lead.industry?tx(bg):txMid(bg), outline:"none", cursor:"pointer", appearance:"none" }}>
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <Btn bg={bg} onClick={async () => {
                const e=validate();
                if(Object.keys(e).length>0){setErrs(e);return;}
                setErrs({});
                // Fire lead capture immediately — before quiz even starts
                await submitLead(lead);
                setSecIdx(0);
                setScreen("quiz");
              }} style={{ width:"100%" }}>
                Start the Brand Audit
              </Btn>

              <p style={{ ...LABEL, color:txDim(bg), textAlign:"center", marginTop:"18px" }}>
                Your information is kept confidential
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     QUIZ — dark #0C0C0C, section header band in #333031
  ══════════════════════════════════════════════════════════════════════════ */
  if (screen==="quiz") {
    const mainBg   = T.bg;
    const headerBg = T.s1;
    const sec      = SECTIONS[secIdx];
    const canGo    = secDone(secIdx);
    const qOffset  = SECTIONS.slice(0,secIdx).reduce((t,s)=>t+s.questions.length,0);

    return (
      <>
        <style>{css}</style>
        <div style={{ fontFamily:T.F, background:mainBg, minHeight:"100vh" }}>

          {/* Sticky progress bar */}
          <div style={{ position:"sticky", top:0, zIndex:20, background:mainBg, borderBottom:`1px solid ${bord(mainBg)}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 48px 12px" }}>
              <span style={{ ...LABEL, color:txDim(mainBg) }}>Brand Audit · Section {sec.num} of {SECTIONS.length}</span>
              <span style={{ ...LABEL, color:txDim(mainBg) }}>{progress}% complete</span>
            </div>
            <div style={{ height:"1px", background:bord(mainBg) }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"rgba(255,255,255,0.35)", transition:"width 0.4s ease" }}/>
            </div>
          </div>

          {/* Section header — warm dark band */}
          <div style={{ background:headerBg, padding:"48px 48px 36px", borderBottom:`1px solid ${bord(headerBg)}` }}>
            <div style={{ maxWidth:"700px", margin:"0 auto" }}>
              <SecHeader
                num={sec.num} total={SECTIONS.length}
                label={sec.label} sub={sec.sub}
                bg={headerBg}
              />
            </div>
          </div>

          {/* Questions — on main dark bg */}
          <div style={{ maxWidth:"700px", margin:"0 auto", padding:"48px 32px 100px" }}>
            {sec.questions.map((q,qi)=>{
              const qNum=qOffset+qi+1;
              return (
                <div key={q.id} style={{ marginBottom:"40px" }}>
                  <div style={{ display:"flex", gap:"20px", alignItems:"flex-start", marginBottom:"16px" }}>
                    <span style={{ ...LABEL, color:txDim(mainBg), paddingTop:"2px", flexShrink:0 }}>Q{qNum}</span>
                    {/* Question text — regular weight for readability */}
                    <p style={{ ...BODY, fontSize:"0.85rem", fontWeight:400, color:T.off, margin:0, lineHeight:1.6 }}>{q.text}</p>
                  </div>

                  <div style={{ marginLeft:"36px", borderTop:`1px solid ${bord(mainBg)}` }}>
                    {q.type==="single"&&q.opts.map(opt=>(
                      <OptionRow key={opt.l} label={opt.l} type="radio"
                        selected={answers[q.id]?.l===opt.l} onClick={()=>setSingle(q.id,opt)} bg={mainBg}/>
                    ))}
                    {q.type==="multi"&&q.opts.map(opt=>(
                      <OptionRow key={opt.l} label={opt.l} type="multi"
                        selected={(answers[q.id]||[]).some(o=>o.l===opt.l)} onClick={()=>toggleMulti(q.id,opt)} bg={mainBg}/>
                    ))}
                    {q.type==="text"&&(
                      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${bord(mainBg)}` }}>
                        <input type="text" placeholder={q.placeholder} value={answers[q.id]?.l||""}
                          onChange={e=>setText(q.id,e.target.value)}
                          style={{ ...BODY, fontSize:"0.82rem", width:"100%", background:"transparent", border:"none", borderBottom:`1px solid ${bord(mainBg)}`, padding:"8px 0", color:T.white, outline:"none" }}/>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Navigation */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"32px", borderTop:`1px solid ${bord(mainBg)}` }}>
              <button onClick={()=>secIdx>0?setSecIdx(s=>s-1):setScreen("lead")}
                style={{ ...LABEL, color:txMid(mainBg), background:"none", border:"none", cursor:"pointer" }}>
                ← Back
              </button>
              <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                {SECTIONS.map((_,i)=>(
                  <div key={i} style={{ width:i===secIdx?"20px":"4px", height:"4px", borderRadius:"2px", background:i<secIdx?"rgba(255,255,255,0.45)":i===secIdx?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.1)", transition:"all 0.3s ease" }}/>
                ))}
              </div>
              <Btn bg={mainBg} outline={!canGo}
                onClick={canGo ? async () => {
                  if (secIdx < SECTIONS.length - 1) {
                    setSecIdx(s => s + 1);
                  } else {
                    // Fire full results submission, then show results regardless
                    await submitResults(answers);
                    setScreen("results");
                  }
                } : undefined}
                style={{ cursor:canGo?"pointer":"not-allowed", opacity:canGo?1:0.4, padding:"12px 24px" }}>
                {submitting ? "Submitting…" : secIdx < SECTIONS.length - 1 ? "Next" : "View Results"}
              </Btn>
            </div>
            {!canGo&&<p style={{ ...LABEL, color:txDim(mainBg), textAlign:"right", marginTop:"10px" }}>Answer all required questions to continue</p>}
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     RESULTS — alternating section backgrounds
     Hero:             #0C0C0C  (dark)
     Score Breakdown:  #333031  (warm dark)
     Key Findings:     #ffffff  (white)
     Recommendations:  #333031  (warm dark)
     Perception Gap:   #ffffff  (white)
     CTA:              #0C0C0C  (dark)
  ══════════════════════════════════════════════════════════════════════════ */
  if (screen==="results") {
    const wantDesc=answers.q18?.l||"";
    const haveDesc=answers.q19?.l||"";
    const percGap=wantDesc&&haveDesc&&wantDesc!==haveDesc;

    const heroBg  = T.bg;
    const scoreBg = T.s1;
    const findBg  = T.s2;
    const recBg   = T.s1;
    const percBg  = T.s2;
    const ctaBg   = T.bg;

    /* Section wrapper */
    const Sec = ({ bg, children }) => (
      <div style={{ background:bg, borderBottom:`1px solid ${bord(bg)}` }}>
        <div style={{ maxWidth:"980px", margin:"0 auto", padding:"56px 48px" }}>
          {children}
        </div>
      </div>
    );

    /* Section heading row */
    const SH = ({ label, bg }) => (
      <div style={{ ...LABEL, color:txDim(bg), marginBottom:"28px" }}>{label}</div>
    );

    return (
      <>
        <style>{css}</style>
        <div style={{ fontFamily:T.F }}>

          {/* ── Hero (dark) ── */}
          <div style={{ background:heroBg, borderBottom:`1px solid ${bord(heroBg)}` }}>
            <div style={{ maxWidth:"980px", margin:"0 auto", padding:"72px 48px 60px" }}>
              <div style={{ ...LABEL, color:txDim(heroBg), marginBottom:"28px" }}>Brand Audit Results</div>

              {/* Submission error — shown only if Formspree POST failed */}
              {submitError && (
                <div style={{ ...BODY, fontSize:"0.72rem", color:"rgba(255,255,255,0.4)", marginBottom:"20px", padding:"10px 16px", border:"1px solid rgba(255,255,255,0.1)" }}>
                  Note: your results couldn't be sent automatically — please email&nbsp;
                  <a href="mailto:hello@hypercreatives.agency" style={{ color:"rgba(255,255,255,0.55)", textDecoration:"underline" }}>hello@hypercreatives.agency</a>
                  &nbsp;to receive your report.
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"40px" }}>
                <div>
                  {/* Business name — thin display H1 */}
                  <div style={{ ...DISP, fontSize:"clamp(1.8rem,5vw,4rem)", color:tx(heroBg), lineHeight:0.95, marginBottom:"4px" }}>{lead.business||"Your Brand"}</div>
                  <div style={{ ...DISP, fontSize:"clamp(1.8rem,5vw,4rem)", color:"rgba(255,255,255,0.2)", lineHeight:0.95 }}>Audit Report</div>
                  <div style={{ width:"1px", height:"32px", background:"rgba(255,255,255,0.1)", margin:"28px 0" }}/>
                  {/* Body — regular */}
                  <p style={{ ...BODY, fontSize:"0.82rem", color:txMid(heroBg), maxWidth:"400px" }}>
                    {sc.overall>=70?"Your brand has solid foundations. There are still clear opportunities to sharpen your edge."
                    :sc.overall>=50?"Your brand is developing, but there are significant gaps costing you customers."
                    :"Your brand needs urgent attention. The right moves can make a significant difference quickly."}
                  </p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"14px" }}>
                  <ScoreArc score={sc.overall} size={130}/>
                  {/* Tier label in tier colour */}
                  <span style={{ ...LABEL, fontSize:"0.56rem", color:tier.hex, border:`1px solid ${tier.hex}`, padding:"3px 10px" }}>{tier.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Score Breakdown (#333031) ── */}
          <Sec bg={scoreBg}>
            <SH label="Score Breakdown" bg={scoreBg}/>
            {[{l:"Brand Foundation",p:sc.aP,r:sc.aRaw,m:sc.aMax},
              {l:"Brand Marketing",  p:sc.bP,r:sc.bRaw,m:sc.bMax},
              {l:"Social Media",     p:sc.cP,r:sc.cRaw,m:sc.cMax}]
              .map(({l,p,r,m})=><PillarBar key={l} label={l} pct={p} pts={r} maxPts={m} bg={scoreBg}/>)}
          </Sec>

          {/* ── Key Findings (#ffffff) ── */}
          <Sec bg={findBg}>
            <SH label="Key Findings" bg={findBg}/>
            {findings.map((f,i)=>(
              <div key={i} style={{ display:"flex", gap:"20px", padding:"18px 0", borderBottom:`1px solid ${bord(findBg)}` }}>
                <span style={{ ...LABEL, color:txDim(findBg), flexShrink:0, paddingTop:"2px" }}>
                  {f.type==="strength"?"✓":"—"}
                </span>
                {/* Body copy — regular weight */}
                <p style={{ ...BODY, fontSize:"0.82rem", color:txMid(findBg), margin:0 }}>{f.text}</p>
              </div>
            ))}
          </Sec>

          {/* ── Priority Recommendations (#333031) — Priority = red accents ── */}
          <Sec bg={recBg}>
            <SH label="Priority Recommendations" bg={recBg}/>
            {recs.map((rec,i)=>{
              const isPri = rec.p==="Priority";
              const isQW  = rec.p==="Quick Win";
              /* number and label colour logic */
              const numCol   = isPri ? T.pRed : txDim(recBg);
              const badgeCol = isPri ? T.pRed : isQW ? T.orange : txMid(recBg);
              const badgeBord= isPri ? T.pRed : isQW ? T.orange : bord2x(recBg);
              return (
                <div key={i} style={{ padding:"28px 0", borderBottom:`1px solid ${bord(recBg)}` }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:"16px", marginBottom:"12px", flexWrap:"wrap" }}>
                    {/* Number — red if Priority */}
                    <span style={{ ...LABEL, color:numCol }}>0{i+1}</span>
                    {/* Label badge — red border + text if Priority */}
                    <span style={{ ...LABEL, fontSize:"0.55rem", color:badgeCol, border:`1px solid ${badgeBord}`, padding:"2px 8px" }}>
                      {rec.p}
                    </span>
                    {/* Sub-heading — Light weight */}
                    <span style={{ ...SUBHEAD, fontSize:"0.88rem", color:tx(recBg) }}>{rec.t}</span>
                  </div>
                  {/* Body — regular weight */}
                  <p style={{ ...BODY, fontSize:"0.8rem", color:txMid(recBg) }}>{rec.d}</p>
                </div>
              );
            })}
          </Sec>

          {/* ── Perception Gap (#ffffff) — only if data exists ── */}
          {(wantDesc||haveDesc)&&(
            <Sec bg={percBg}>
              <SH label="Brand Perception Gap" bg={percBg}/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px", background:bord(percBg), marginBottom:percGap?"16px":"0" }}>
                {[{l:"Intended Perception",v:wantDesc,bg:surfBg(percBg)},{l:"Current Reality",v:haveDesc,bg:percBg}].map(({l,v,bg:cb})=>(
                  <div key={l} style={{ padding:"28px 24px", background:cb }}>
                    <div style={{ ...LABEL, color:txDim(percBg), marginBottom:"12px" }}>{l}</div>
                    {/* Perception words — Light sub-heading weight */}
                    <div style={{ ...SUBHEAD, fontSize:"1rem", color:tx(percBg) }}>{v||"—"}</div>
                  </div>
                ))}
              </div>
              {percGap&&(
                <p style={{ ...BODY, fontSize:"0.8rem", color:txMid(percBg), padding:"16px 20px", borderLeft:`1px solid ${bord2x(percBg)}` }}>
                  A meaningful gap exists between intended and current perception for {lead.business||"your brand"}. Closing this gap is a high-impact brand priority and the clearest entry point for brand strategy work.
                </p>
              )}
            </Sec>
          )}

          {/* ── CTA (#0C0C0C) ── */}
          <Sec bg={ctaBg}>
            <div style={{ textAlign:"center" }}>
              <div style={{ ...LABEL, color:txDim(ctaBg), marginBottom:"20px" }}>What's next</div>
              {/* H1-style thin display */}
              <div style={{ ...DISP, fontSize:"clamp(1.6rem,4vw,3rem)", color:tx(ctaBg), marginBottom:"4px" }}>Let's close the gap</div>
              <div style={{ ...DISP, fontSize:"clamp(1.6rem,4vw,3rem)", color:"rgba(255,255,255,0.25)", marginBottom:"24px" }}>together.</div>
              {/* Body — regular */}
              <p style={{ ...BODY, fontSize:"0.82rem", color:txMid(ctaBg), maxWidth:"380px", margin:"0 auto 36px" }}>
                Book a complimentary Brand Discovery Call with Hyper Creatives. We'll walk through your results and show you exactly where to start.
              </p>
              <div style={{ display:"flex", justifyContent:"center", gap:"14px", flexWrap:"wrap" }}>
                <Btn bg={ctaBg} outline onClick={()=>setShowReport(true)}>Download Report</Btn>
                <a href="https://www.hypercreatives.agency" target="_blank" rel="noreferrer"
                  style={{ ...DISP, fontSize:"0.7rem", letterSpacing:"0.1em", padding:"14px 32px", background:T.white, color:T.bg, textDecoration:"none", display:"inline-block" }}>
                  Book a Discovery Call
                </a>
              </div>
              <div style={{ marginTop:"32px" }}>
                <button onClick={()=>{setScreen("intro");setAnswers({});setSecIdx(0);setLead({name:"",business:"",email:"",industry:""});}}
                  style={{ ...LABEL, color:txDim(ctaBg), background:"none", border:"none", cursor:"pointer" }}>
                  Start over
                </button>
              </div>
            </div>
          </Sec>

        </div>
      </>
    );
  }

  return null;
}
