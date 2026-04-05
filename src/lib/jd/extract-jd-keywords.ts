/**
 * Deterministic keyword extraction engine for job descriptions.
 * Extracts skills, tools, technologies, action verbs, and domain keywords
 * from unstructured JD text using pattern matching and frequency analysis.
 */

// Common filler words to ignore
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","is","are","was","were","be","been","being",
  "have","has","had","do","does","did","will","would","could","should","may",
  "might","shall","can","need","dare","ought","used","to","of","in","for",
  "on","with","at","by","from","as","into","through","during","before",
  "after","above","below","between","out","off","over","under","again",
  "further","then","once","here","there","when","where","why","how","all",
  "each","every","both","few","more","most","other","some","such","no",
  "nor","not","only","own","same","so","than","too","very","just","about",
  "up","if","it","its","we","our","you","your","they","their","them","this",
  "that","these","those","he","she","him","her","his","what","which","who",
  "whom","my","me","i","us","also","well","per","etc","via","within",
  "including","across","around","along","among","team","work","working",
  "role","position","job","company","candidate","ideal","looking","join",
  "ability","strong","excellent","good","great","required","requirements",
  "qualifications","responsibilities","preferred","must","plus","bonus",
  "minimum","experience","years","year","knowledge","understanding",
  "skills","skill","proficiency","proficient","environment","opportunity",
  "based","help","ensure","provide","support","develop","create","manage",
  "build","lead","drive","deliver","maintain","implement","improve","using",
  "related","relevant"
])

// Common tech skills / tools patterns
const TECH_PATTERNS = [
  "react","next.js","nextjs","node.js","nodejs","typescript","javascript",
  "python","java","go","golang","rust","c++","c#","ruby","php","swift","kotlin",
  "html","css","tailwind","sass","less",
  "aws","azure","gcp","google cloud","docker","kubernetes","k8s","terraform",
  "jenkins","ci/cd","github actions","gitlab","bitbucket",
  "postgresql","postgres","mysql","mongodb","redis","elasticsearch","dynamodb",
  "graphql","rest","api","grpc","websocket",
  "figma","sketch","adobe xd",
  "git","jira","confluence","slack","notion",
  "tensorflow","pytorch","scikit-learn","pandas","numpy",
  "spark","kafka","rabbitmq","celery",
  "linux","unix","bash","shell",
  "agile","scrum","kanban","waterfall",
  "sql","nosql","orm","prisma","drizzle","supabase","firebase",
  "vue","angular","svelte","ember",
  "express","fastapi","django","flask","spring","rails",
  "vercel","netlify","heroku","cloudflare",
  "stripe","twilio","sendgrid",
  "oauth","jwt","sso","saml","auth0",
  "webpack","vite","esbuild","rollup","parcel",
  "jest","cypress","playwright","testing","unit test","integration test",
  "microservices","monolith","serverless","lambda","edge functions",
  "machine learning","ml","ai","nlp","llm","deep learning","generative ai",
  "data science","data engineering","data pipeline","etl",
  "tableau","power bi","looker","metabase",
  "s3","ec2","rds","cloudfront","route 53","ecs","fargate",
  "ci","cd","devops","sre","infrastructure",
]

const ACTION_VERBS = [
  "design","architect","develop","build","implement","deploy","ship",
  "optimize","scale","debug","troubleshoot","refactor","migrate",
  "collaborate","mentor","lead","coordinate","communicate","present",
  "analyze","research","evaluate","assess","measure","monitor",
  "automate","integrate","configure","test","validate","review",
  "document","plan","prioritize","strategize","innovate",
]

const SENIORITY_MARKERS: Record<string, string[]> = {
  junior: ["junior","entry-level","entry level","associate","intern","internship","graduate","0-2 years","1-2 years","new grad"],
  mid: ["mid-level","mid level","intermediate","3-5 years","2-4 years","3+ years"],
  senior: ["senior","sr.","sr ","5+ years","5-8 years","7+ years","8+ years","experienced"],
  lead: ["lead","principal","staff","tech lead","team lead","engineering lead","architect","10+ years"],
  executive: ["director","vp","vice president","head of","chief","cto","ceo","coo","c-level","svp","evp"],
}

export function extractJDKeywords(text: string): {
  keywords: string[]
  tools_technologies: string[]
  action_verbs: string[]
  seniority_level: "junior" | "mid" | "senior" | "lead" | "executive" | "unknown"
} {
  const lowerText = text.toLowerCase()

  // Extract tech/tools by matching known patterns
  const foundTools = TECH_PATTERNS.filter((tech) =>
    lowerText.includes(tech.toLowerCase())
  )

  // Extract action verbs
  const foundVerbs = ACTION_VERBS.filter((verb) =>
    lowerText.includes(verb.toLowerCase())
  )

  // Determine seniority
  let seniority: "junior" | "mid" | "senior" | "lead" | "executive" | "unknown" = "unknown"
  for (const [level, markers] of Object.entries(SENIORITY_MARKERS)) {
    for (const marker of markers) {
      if (lowerText.includes(marker)) {
        seniority = level as typeof seniority
        break
      }
    }
    if (seniority !== "unknown") break
  }

  // Extract general keywords via frequency analysis
  const words = lowerText
    .replace(/[^a-z0-9\s\-\.\/\+\#]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))

  const frequency: Record<string, number> = {}
  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1
  }

  // Sort by frequency, take the top keywords
  const keywords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word)

  return {
    keywords,
    tools_technologies: [...new Set(foundTools)],
    action_verbs: [...new Set(foundVerbs)],
    seniority_level: seniority,
  }
}
