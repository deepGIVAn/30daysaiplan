import fs from "fs";
import path from "path";
import type { DayContent, PhaseId } from "../src/types";
import { getPhaseForDay } from "../src/lib/books/phases";

const OUTPUT_DIR = path.join(
  process.cwd(),
  "content/books/30-day-ai-personal-brand-plan",
);

const DAYS: Array<{
  title: string;
  objective: string;
  whyItMatters: string;
  workSummary: string[];
  aiPrompt: string;
  reflectionPrompts: string[];
  actionSteps: string[];
  optionalPost: string;
}> = [
  {
    title: "Conduct a Personal Brand Audit",
    objective:
      "Get brutally honest about your current brand footprint — online and offline — and uncover what needs to evolve.",
    whyItMatters:
      "Visibility isn't just about being online. It's about being positioned where your audience is looking — with intention, strategy, and presence.",
    workSummary: [
      "Review your digital presence: Google results, LinkedIn, social profiles",
      "Check professional perception — how would others introduce you?",
      "Audit your content and communication consistency",
      "Rate each area from 1–5 and note one proud moment and one urgent improvement",
    ],
    aiPrompt:
      "I'm conducting a personal brand audit. Here is my LinkedIn About section and bio: [paste here]. Please review my digital presence and give me 3 specific observations about what's working, what's misaligned, and what I should improve first.",
    reflectionPrompts: [
      "What is one thing I'm proud of in my current brand?",
      "What area urgently needs improvement?",
      "How aligned is my online presence with who I want to become?",
    ],
    actionSteps: [
      "Google your name in Incognito Mode — take a screenshot",
      "Review LinkedIn and social profiles — write 3 key observations",
      "Use the AI prompt to get fast feedback",
      "Capture one insight you didn't expect",
      "Identify one branding asset you'll improve this week",
    ],
    optionalPost:
      "Just completed a personal brand audit today — the difference between perception and intention is real. Time to realign my brand with who I truly am.",
  },
  {
    title: "Identify Your Top 3 Brand Values",
    objective:
      "Anchor your personal brand in core values — the non-negotiables that define your decisions and shape how others experience you.",
    whyItMatters:
      "Your values act as a filter. They tell you what to say yes to and give your audience a reason to trust you.",
    workSummary: [
      "Reflect on 2–3 peak brand moments in your career",
      "Choose your top 3 values from the curated brand values list",
      "Define what each value means to your brand in one line",
    ],
    aiPrompt:
      "Based on these peak moments in my career: [describe 2-3 moments], help me identify my top 3 brand values and write a one-line definition for each that I can use in my personal branding.",
    reflectionPrompts: [
      "What value do people consistently see in me?",
      "What value am I aspiring to show more of?",
      "What value feels most non-negotiable to who I am?",
    ],
    actionSteps: [
      "List 2–3 peak brand moments from your career",
      "Select your top 3 brand values",
      "Write a one-line definition for each value",
      "Use the AI prompt to sharpen your choices",
      "Save your values somewhere visible for daily reference",
    ],
    optionalPost:
      "Defined my top 3 brand values today. Clarity creates consistency — and consistency builds trust.",
  },
  {
    title: "Define Your Target Audience Persona",
    objective:
      "Get crystal clear on who you're building your brand for — the specific people you want to influence, serve, and attract.",
    whyItMatters:
      "A brand that tries to speak to everyone speaks to no one. Clarity about your audience sharpens every message you create.",
    workSummary: [
      "Define your ideal audience demographics and psychographics",
      "Identify their pain points, goals, and where they spend time online",
      "Create a one-paragraph audience persona document",
    ],
    aiPrompt:
      "I am building a personal brand as a [your role/industry]. Help me create a detailed target audience persona including demographics, pain points, goals, and the platforms where they are most active.",
    reflectionPrompts: [
      "Who do I most enjoy serving or leading?",
      "What problem am I uniquely positioned to solve for them?",
      "Where does my audience already spend their attention?",
    ],
    actionSteps: [
      "Write a one-paragraph description of your ideal audience",
      "List 3 pain points your audience faces",
      "List 3 goals your audience wants to achieve",
      "Identify 2 platforms where your audience is most active",
      "Save your persona as a reference for all future content",
    ],
    optionalPost:
      "Got clear on who I'm building my brand for today. When you know your audience, every post has purpose.",
  },
  {
    title: "Craft Your Brand Vision & Purpose",
    objective:
      "Define where your brand is going and why it matters — creating a north star that guides every decision.",
    whyItMatters:
      "Without vision, your brand drifts. A clear purpose magnetizes the right opportunities and repels the wrong ones.",
    workSummary: [
      "Write your 3-year brand vision statement",
      "Articulate your brand purpose in one powerful sentence",
      "Connect your values to your vision",
    ],
    aiPrompt:
      "My top 3 brand values are: [values]. My target audience is: [persona]. Help me write a compelling 3-year brand vision statement and a one-sentence brand purpose.",
    reflectionPrompts: [
      "What impact do I want my brand to have in 3 years?",
      "Why does my work matter beyond income?",
      "What legacy do I want my brand to leave?",
    ],
    actionSteps: [
      "Draft your 3-year brand vision (2–3 sentences)",
      "Write your brand purpose in one sentence",
      "Use the AI prompt to refine your vision and purpose",
      "Read your vision aloud — does it energize you?",
      "Save your vision where you'll see it daily",
    ],
    optionalPost:
      "Defined my brand vision and purpose today. A brand without direction is just noise.",
  },
  {
    title: "Write Your One-Line Brand Positioning Statement",
    objective:
      "Distill your entire brand into one memorable line that tells people who you are, who you serve, and what makes you different.",
    whyItMatters:
      "When you can position yourself in one line, every conversation, bio, and pitch becomes sharper and more confident.",
    workSummary: [
      "Use the positioning formula: I help [audience] achieve [outcome] through [unique approach]",
      "Test your statement with the 'elevator test' — can someone repeat it back?",
      "Refine until it's clear, specific, and memorable",
    ],
    aiPrompt:
      "My audience is [persona], my values are [values], and my differentiator is [what makes you unique]. Write 5 variations of a one-line brand positioning statement using the formula: I help [audience] achieve [outcome] through [approach].",
    reflectionPrompts: [
      "Can I say my positioning statement in under 10 seconds?",
      "Does it clearly communicate who I help and how?",
      "Would my ideal client immediately recognize themselves?",
    ],
    actionSteps: [
      "Draft 3 versions of your positioning statement",
      "Use the AI prompt to generate and refine options",
      "Choose your final one-line statement",
      "Test it with one trusted colleague or friend",
      "Add it to your notes app for easy access",
    ],
    optionalPost:
      "Nailed my one-line brand positioning today. Clarity in one sentence changes everything.",
  },
  {
    title: "Build Your Signature Story",
    objective:
      "Craft the origin story that makes you memorable — the narrative that connects your past, present, and brand promise.",
    whyItMatters:
      "Facts tell, stories sell. Your signature story is the emotional bridge between you and your audience.",
    workSummary: [
      "Identify the pivotal moment that shaped your brand journey",
      "Structure your story: challenge → turning point → transformation → mission",
      "Write a 2-minute version of your signature story",
    ],
    aiPrompt:
      "Help me craft my signature brand story. My background: [brief background]. My pivotal moment: [describe]. My mission now: [purpose]. Structure it as challenge → turning point → transformation → mission in about 200 words.",
    reflectionPrompts: [
      "What moment changed the direction of my career or life?",
      "What struggle will my audience relate to?",
      "What transformation do I want my story to inspire?",
    ],
    actionSteps: [
      "Write your pivotal moment in 3–5 sentences",
      "Draft your signature story using the 4-part structure",
      "Use the AI prompt to polish your narrative",
      "Practice telling your story in under 2 minutes",
      "Save both a written and spoken version",
    ],
    optionalPost:
      "Crafted my signature story today. Your story is your strategy — own it.",
  },
  {
    title: "Identify Your Brand Differentiator",
    objective:
      "Discover what makes you unmistakably you — the unique angle only you can own in your market.",
    whyItMatters:
      "In a crowded market, differentiation isn't optional. It's the reason someone chooses you over everyone else.",
    workSummary: [
      "List your unique skills, experiences, and perspectives",
      "Identify what you do differently from others in your space",
      "Articulate your differentiator in one clear statement",
    ],
    aiPrompt:
      "I work in [industry] and my competitors typically [common approach]. My unique experiences include [list]. Help me identify my brand differentiator and write a compelling statement about what makes me uniquely valuable.",
    reflectionPrompts: [
      "What do clients or colleagues say only I can do?",
      "What intersection of skills do I uniquely occupy?",
      "What would the market lose if I didn't show up?",
    ],
    actionSteps: [
      "List 5 things that make your approach unique",
      "Research 3 peers in your space — note what they emphasize",
      "Write your differentiator in one sentence",
      "Use the AI prompt to sharpen your angle",
      "Integrate your differentiator into your positioning statement",
    ],
    optionalPost:
      "Identified what makes my brand different today. Different isn't better — different is remembered.",
  },
  {
    title: "Optimise Your LinkedIn Profile",
    objective:
      "Transform your LinkedIn profile into a brand asset that attracts the right audience and opportunities.",
    whyItMatters:
      "LinkedIn is often the first place people research you. A optimised profile builds trust before you ever speak.",
    workSummary: [
      "Rewrite your headline using your positioning statement",
      "Update your About section with your signature story",
      "Optimise your featured section and banner image",
    ],
    aiPrompt:
      "Here is my current LinkedIn About section: [paste]. My positioning: [statement]. My signature story: [brief]. Rewrite my LinkedIn headline and About section to be compelling, keyword-rich, and aligned with my personal brand.",
    reflectionPrompts: [
      "Does my headline immediately communicate my value?",
      "Would a stranger understand what I do in 10 seconds?",
      "Does my profile reflect my brand values and vision?",
    ],
    actionSteps: [
      "Update your LinkedIn headline",
      "Rewrite your About section (use AI prompt)",
      "Add or update your banner and profile photo",
      "Add 2–3 featured items (posts, articles, or links)",
      "Ask a colleague to review your updated profile",
    ],
    optionalPost:
      "Just optimised my LinkedIn profile. Your profile is your digital handshake — make it count.",
  },
  {
    title: "Update All Your Social Bios",
    objective:
      "Ensure every platform tells the same brand story — consistent, clear, and compelling across all touchpoints.",
    whyItMatters:
      "Inconsistent bios confuse your audience. Consistency across platforms builds recognition and trust.",
    workSummary: [
      "Audit bios on all active social platforms",
      "Rewrite each bio using your positioning statement",
      "Ensure visual consistency (photos, colors, tone)",
    ],
    aiPrompt:
      "My brand positioning is: [statement]. Write optimised bios for LinkedIn (220 chars), Instagram (150 chars), Twitter/X (160 chars), and a general website bio (100 words). Keep tone consistent and compelling.",
    reflectionPrompts: [
      "Do all my bios tell the same story?",
      "Is my value proposition clear on every platform?",
      "Which platform bio needs the most work?",
    ],
    actionSteps: [
      "List all platforms where you have a public profile",
      "Update each bio using your positioning statement",
      "Use the AI prompt to create platform-specific versions",
      "Ensure profile photos are consistent and professional",
      "Screenshot your updated bios for reference",
    ],
    optionalPost:
      "Aligned all my social bios today. Consistency is the compound interest of personal branding.",
  },
  {
    title: "Record a 60-Second Branded Intro Video",
    objective:
      "Create a short video introduction that captures your brand energy, positioning, and personality.",
    whyItMatters:
      "Video builds trust faster than text. A 60-second intro makes you real, relatable, and memorable.",
    workSummary: [
      "Write a 60-second script using your positioning and story",
      "Record on your phone in good lighting",
      "Upload to LinkedIn, website, or email signature",
    ],
    aiPrompt:
      "Write a 60-second video introduction script for me. My positioning: [statement]. My signature story highlight: [key moment]. Tone: confident, warm, professional. Include a clear call to action at the end.",
    reflectionPrompts: [
      "Does my video sound like me — not a corporate robot?",
      "Is my value proposition clear within the first 15 seconds?",
      "What feeling do I want viewers to walk away with?",
    ],
    actionSteps: [
      "Write your 60-second script (use AI prompt)",
      "Practice reading it aloud 3 times",
      "Record your video in good lighting",
      "Watch it back and re-record if needed",
      "Upload to at least one platform today",
    ],
    optionalPost:
      "Recorded my 60-second brand intro video today. Show up on camera — your audience wants to see the real you.",
  },
  {
    title: "Build a Personal Visual Identity",
    objective:
      "Define the visual elements that make your brand recognizable — colors, fonts, and imagery style.",
    whyItMatters:
      "Visual consistency makes your brand instantly recognizable in a crowded feed.",
    workSummary: [
      "Choose 2–3 brand colors that reflect your values",
      "Select fonts for headings and body text",
      "Create a simple brand mood board",
    ],
    aiPrompt:
      "My brand values are [values] and my positioning is [statement]. Suggest a personal brand color palette (3 colors with hex codes), font pairings, and visual style guidelines for my social media content.",
    reflectionPrompts: [
      "What colors feel authentically 'me'?",
      "Is my visual style consistent across platforms?",
      "Would someone recognize my content without seeing my name?",
    ],
    actionSteps: [
      "Choose 3 brand colors and note their hex codes",
      "Select heading and body fonts",
      "Create a simple mood board (Canva or Pinterest)",
      "Use the AI prompt for palette suggestions",
      "Apply your colors to one social media template",
    ],
    optionalPost:
      "Built my personal visual identity today. How you look is part of how you're remembered.",
  },
  {
    title: "Define Your 3 Core Content Pillars",
    objective:
      "Establish the three themes you'll consistently create content around — your brand's editorial foundation.",
    whyItMatters:
      "Content pillars eliminate guesswork. You'll always know what to post and why it matters to your audience.",
    workSummary: [
      "Identify 3 themes aligned with your expertise and audience needs",
      "Define 2–3 subtopics under each pillar",
      "Map pillars to your brand values and positioning",
    ],
    aiPrompt:
      "My positioning is [statement], my audience is [persona], and my expertise is in [area]. Define 3 core content pillars with 3 subtopics each that will establish my thought leadership.",
    reflectionPrompts: [
      "What topics could I talk about for hours?",
      "What does my audience need to learn from me?",
      "Do my pillars support my positioning statement?",
    ],
    actionSteps: [
      "List 5 topics you could teach or discuss",
      "Narrow to 3 core content pillars",
      "Define 3 subtopics under each pillar",
      "Use the AI prompt to validate your pillars",
      "Save your content pillar document",
    ],
    optionalPost:
      "Defined my 3 core content pillars today. When you know what to say, showing up becomes easy.",
  },
  {
    title: "Publish a Thought Leadership Post",
    objective:
      "Share your first (or next) piece of thought leadership content that demonstrates your expertise and point of view.",
    whyItMatters:
      "Thought leadership isn't about being the smartest — it's about having a clear point of view and sharing it generously.",
    workSummary: [
      "Choose one content pillar and one subtopic",
      "Write a post with a hook, insight, and call to action",
      "Publish on LinkedIn or your primary platform",
    ],
    aiPrompt:
      "Write a thought leadership LinkedIn post about [topic] for my audience of [persona]. My point of view is [your angle]. Include a strong hook, 3 key insights, and a question to drive engagement. Keep it under 250 words.",
    reflectionPrompts: [
      "Does this post reflect my unique point of view?",
      "Would my ideal audience find this valuable?",
      "Am I sharing insight or just information?",
    ],
    actionSteps: [
      "Choose your topic from a content pillar",
      "Draft your post (use AI prompt for structure)",
      "Add a compelling hook in the first line",
      "Publish on your primary platform",
      "Engage with every comment in the first 2 hours",
    ],
    optionalPost:
      "Published my thought leadership post today. Your perspective is your power — share it.",
  },
  {
    title: "Join or Launch 2 Strategic Online Communities",
    objective:
      "Place yourself where your audience gathers — communities are where relationships and opportunities compound.",
    whyItMatters:
      "Your network is your net worth. Strategic communities put you in rooms with the right people.",
    workSummary: [
      "Identify 2 communities where your ideal audience is active",
      "Join and introduce yourself authentically",
      "Contribute value before asking for anything",
    ],
    aiPrompt:
      "My target audience is [persona] in the [industry] space. Recommend 5 strategic online communities (LinkedIn groups, Slack communities, forums) where I should participate to build my personal brand. Include why each is valuable.",
    reflectionPrompts: [
      "Am I in communities where my ideal clients hang out?",
      "Am I contributing value or just lurking?",
      "Could I launch a community around my expertise?",
    ],
    actionSteps: [
      "Research and list 5 potential communities",
      "Join 2 communities today",
      "Write and post an authentic introduction",
      "Comment thoughtfully on 3 posts in each community",
      "Set a weekly reminder to engage consistently",
    ],
    optionalPost:
      "Joined two strategic communities today. Your brand grows where you show up consistently.",
  },
  {
    title: "Collect 3 Strategic Testimonials",
    objective:
      "Gather social proof that validates your brand promise — testimonials from people who've experienced your value.",
    whyItMatters:
      "Third-party validation is more powerful than anything you say about yourself.",
    workSummary: [
      "Identify 5 people who could speak to your value",
      "Reach out with a specific, easy-to-answer request",
      "Collect at least 3 testimonials and publish them",
    ],
    aiPrompt:
      "Write a short, warm message I can send to past clients/colleagues asking for a testimonial. My brand positioning is [statement]. Make it easy for them — suggest 2-3 specific questions they could answer.",
    reflectionPrompts: [
      "Who has experienced my value firsthand?",
      "Am I making it easy for people to recommend me?",
      "Where will I display these testimonials?",
    ],
    actionSteps: [
      "List 5 people who could give you a testimonial",
      "Send personalized requests to 3 of them",
      "Use the AI prompt to craft your request message",
      "Follow up with anyone who hasn't responded in 3 days",
      "Add received testimonials to LinkedIn or your website",
    ],
    optionalPost:
      "Collected strategic testimonials today. Let others tell your story — it's more powerful than telling it yourself.",
  },
  {
    title: "Publish an Article or Blog",
    objective:
      "Create a longer-form piece of content that establishes depth of expertise beyond social posts.",
    whyItMatters:
      "Articles build SEO, credibility, and give your audience something substantial to share and reference.",
    workSummary: [
      "Choose a topic from your content pillars",
      "Write a 500–800 word article with clear structure",
      "Publish on LinkedIn Articles, Medium, or your blog",
    ],
    aiPrompt:
      "Write an outline for an 800-word thought leadership article on [topic] for [audience]. Include a compelling title, introduction hook, 4 main sections with key points, and a conclusion with a call to action.",
    reflectionPrompts: [
      "Does this article showcase depth, not just breadth?",
      "Would I be proud to send this to a potential client?",
      "Does it align with my positioning and pillars?",
    ],
    actionSteps: [
      "Choose your article topic",
      "Create an outline (use AI prompt)",
      "Write and edit your article",
      "Add a compelling title and featured image",
      "Publish and share across your platforms",
    ],
    optionalPost:
      "Published my first thought leadership article today. Long-form content builds long-term authority.",
  },
  {
    title: "Share a Success Story or Case Study",
    objective:
      "Demonstrate your impact through a real story — showing, not telling, what your brand delivers.",
    whyItMatters:
      "Case studies turn abstract expertise into concrete proof. They're your most persuasive sales tool.",
    workSummary: [
      "Choose a client project or personal win to highlight",
      "Structure it: challenge → approach → result → lesson",
      "Publish as a post, article, or visual story",
    ],
    aiPrompt:
      "Help me structure a case study. The challenge was [describe], my approach was [describe], and the result was [outcome]. Format it as: Challenge → Approach → Result → Key Lesson. Keep it under 300 words for a LinkedIn post.",
    reflectionPrompts: [
      "What result am I most proud of?",
      "Can I share this story without breaking confidentiality?",
      "What lesson will resonate with my audience?",
    ],
    actionSteps: [
      "Select a success story to share",
      "Draft using the challenge → approach → result format",
      "Use the AI prompt to polish your narrative",
      "Add specific numbers or outcomes where possible",
      "Publish and pin to your profile if possible",
    ],
    optionalPost:
      "Shared a success story today. Results speak louder than promises.",
  },
  {
    title: "Create a Lead Magnet (Guide, Checklist, or eBook)",
    objective:
      "Build a valuable free resource that attracts your ideal audience and grows your email list.",
    whyItMatters:
      "A lead magnet exchanges value for attention — it's the bridge between stranger and subscriber.",
    workSummary: [
      "Choose a topic that solves a specific audience pain point",
      "Create a 1–5 page guide, checklist, or template",
      "Set up a simple landing page or LinkedIn lead gen form",
    ],
    aiPrompt:
      "My audience struggles with [pain point]. My expertise is in [area]. Suggest 3 lead magnet ideas (checklist, guide, template) and create an outline for the best one with 5-7 actionable sections.",
    reflectionPrompts: [
      "What quick win could I give my audience for free?",
      "Is this lead magnet aligned with my signature offer?",
      "Would I have found this valuable 2 years ago?",
    ],
    actionSteps: [
      "Choose your lead magnet format and topic",
      "Create the content (use AI for outline)",
      "Design a simple cover in Canva",
      "Set up a download link or landing page",
      "Share it in a post with a clear call to action",
    ],
    optionalPost:
      "Created my first lead magnet today. Give value first — trust and clients follow.",
  },
  {
    title: "Offer Value — Free Consultation, Mentorship or Review",
    objective:
      "Give before you ask — offer a slice of your expertise for free to build relationships and demonstrate value.",
    whyItMatters:
      "Generosity is a brand strategy. When you give freely, you attract people who want to give back.",
    workSummary: [
      "Define what free value you can offer (15-min call, review, audit)",
      "Announce it publicly on your primary platform",
      "Deliver exceptional value to everyone who responds",
    ],
    aiPrompt:
      "I want to offer a free [consultation/mentorship/review] to my audience of [persona]. Write a compelling LinkedIn post announcing this offer, explaining the value, and including a clear way to book or respond.",
    reflectionPrompts: [
      "What can I offer in 15–30 minutes that would genuinely help someone?",
      "Am I prepared to over-deliver on this offer?",
      "How will I convert these conversations into relationships?",
    ],
    actionSteps: [
      "Define your free offer (be specific)",
      "Write and publish your announcement post",
      "Respond to every inquiry within 24 hours",
      "Deliver your session and ask for feedback",
      "Follow up with a thank-you message",
    ],
    optionalPost:
      "Offering free [consultation/mentorship] this week. The best brands give before they ask.",
  },
  {
    title: "Get Featured on a Podcast, Panel or Stage",
    objective:
      "Expand your reach by appearing on someone else's platform — borrowing their audience to grow yours.",
    whyItMatters:
      "Speaking and guest appearances multiply your visibility exponentially with each opportunity.",
    workSummary: [
      "Identify 5 podcasts, panels, or events in your niche",
      "Craft a compelling pitch highlighting your unique angle",
      "Send personalized outreach to at least 3 hosts",
    ],
    aiPrompt:
      "Write a podcast guest pitch for me. My expertise: [area]. My unique angle: [differentiator]. Target podcast theme: [niche]. Include a compelling subject line, 3-sentence pitch, and 3 topic ideas I'd love to discuss.",
    reflectionPrompts: [
      "What unique perspective can I bring to a podcast audience?",
      "Am I pitching value to the host, not just promoting myself?",
      "What's my backup plan if podcasts say no? (LinkedIn Live, webinars)",
    ],
    actionSteps: [
      "Research 5 relevant podcasts or events",
      "Write your guest pitch (use AI prompt)",
      "Send personalized pitches to 3 hosts",
      "Prepare 3 talking points for when they say yes",
      "Follow up after one week if no response",
    ],
    optionalPost:
      "Pitched myself for podcast appearances today. Your voice deserves a bigger stage.",
  },
  {
    title: "Highlight Proof of Authority",
    objective:
      "Curate and showcase the evidence that you're a recognized expert — credentials, features, awards, and results.",
    whyItMatters:
      "Authority isn't claimed — it's demonstrated. Proof removes doubt and accelerates trust.",
    workSummary: [
      "Collect all proof points: media features, awards, certifications, results",
      "Create an 'Authority' section on your profile or website",
      "Weave proof into your content and bios",
    ],
    aiPrompt:
      "Here are my proof points: [list credentials, features, awards, results]. Help me write a compelling 'Proof of Authority' section for my LinkedIn profile and suggest how to weave these into my content strategy.",
    reflectionPrompts: [
      "What proof do I have that I haven't been showcasing?",
      "Would a skeptical stranger be convinced by my authority signals?",
      "Am I letting results speak or just claims?",
    ],
    actionSteps: [
      "List all your authority proof points",
      "Update your LinkedIn Featured section",
      "Add proof to your website or bio",
      "Use the AI prompt to write your authority narrative",
      "Reference one proof point in your next post",
    ],
    optionalPost:
      "Highlighted my proof of authority today. Don't hide your wins — they build trust.",
  },
  {
    title: "Reach Out to 3 New Connections",
    objective:
      "Proactively build relationships with people who can amplify your brand — mentors, peers, and potential collaborators.",
    whyItMatters:
      "Relationships are the infrastructure of a powerful personal brand. Strategic outreach opens doors.",
    workSummary: [
      "Identify 3 people you admire or want to learn from",
      "Send personalized connection requests with genuine value",
      "Follow up with a thoughtful message after connecting",
    ],
    aiPrompt:
      "Write 3 personalized LinkedIn connection request messages. Person 1: [name, role, why you admire them]. Person 2: [details]. Person 3: [details]. Each message should be genuine, specific, and under 300 characters.",
    reflectionPrompts: [
      "Am I reaching out to give or to get?",
      "Is my message specific enough to stand out?",
      "Who are 3 people whose audience overlaps with mine?",
    ],
    actionSteps: [
      "Identify 3 strategic people to connect with",
      "Write personalized connection messages",
      "Send requests today",
      "Follow up with a value-add message after they accept",
      "Schedule one coffee chat or virtual call this week",
    ],
    optionalPost:
      "Reached out to 3 new connections today. Relationships are the compound interest of branding.",
  },
  {
    title: "Engage Strategically on LinkedIn Posts",
    objective:
      "Build visibility and relationships by adding thoughtful comments on posts from leaders in your space.",
    whyItMatters:
      "Strategic commenting puts your name in front of thousands without creating your own content.",
    workSummary: [
      "Find 5 posts from industry leaders published in the last 24 hours",
      "Write thoughtful, value-adding comments (not 'Great post!')",
      "Engage consistently for 30 minutes today",
    ],
    aiPrompt:
      "Here is a LinkedIn post by [author] about [topic]: [paste post]. Write 3 thoughtful comment options that add value, show my expertise in [area], and invite further conversation. Each under 50 words.",
    reflectionPrompts: [
      "Are my comments adding insight or just agreeing?",
      "Am I engaging with the right people's audiences?",
      "Could my comments lead to meaningful conversations?",
    ],
    actionSteps: [
      "Find 5 relevant posts from today",
      "Write and post 5 thoughtful comments",
      "Use the AI prompt if you're stuck on what to say",
      "Reply to any responses you receive",
      "Set a daily 15-minute engagement habit",
    ],
    optionalPost:
      "Spent 30 minutes on strategic LinkedIn engagement today. Comments are micro-content — make them count.",
  },
  {
    title: "Attend a Virtual or In-Person Networking Event",
    objective:
      "Show up in real (or virtual) rooms where your ideal connections gather — and make yourself memorable.",
    whyItMatters:
      "Online branding gets you noticed. In-person (or live virtual) connection turns notice into relationship.",
    workSummary: [
      "Find one relevant event happening this week",
      "Prepare your 30-second intro and 3 conversation starters",
      "Follow up with every meaningful connection within 24 hours",
    ],
    aiPrompt:
      "I'm attending a [type] event for [industry] professionals. Give me 3 conversation starters, a 30-second intro, and 3 thoughtful questions I can ask other attendees to build meaningful connections.",
    reflectionPrompts: [
      "Am I going to give or to get?",
      "What's my follow-up plan for new connections?",
      "How will I stand out without being salesy?",
    ],
    actionSteps: [
      "Find and register for one event this week",
      "Prepare your intro and conversation starters",
      "Attend and aim for 3 meaningful conversations",
      "Connect on LinkedIn with everyone you meet",
      "Send follow-up messages within 24 hours",
    ],
    optionalPost:
      "Attended a networking event today. Show up in person — your brand is built in conversations.",
  },
  {
    title: "Co-Create with a Partner",
    objective:
      "Multiply your reach and credibility by collaborating with a complementary brand or creator.",
    whyItMatters:
      "Collaboration exposes you to new audiences and adds a layer of social proof no solo content can match.",
    workSummary: [
      "Identify one potential collaboration partner",
      "Propose a specific co-creation idea (webinar, post, guide)",
      "Execute or schedule the collaboration",
    ],
    aiPrompt:
      "I want to co-create content with [partner name/role] who specializes in [their area]. My expertise is [your area]. Suggest 3 collaboration ideas (webinar, joint post, guide) and write a pitch message I can send them.",
    reflectionPrompts: [
      "Who has a complementary audience to mine?",
      "What would make this collaboration valuable for both parties?",
      "Am I bringing as much value as I'm asking for?",
    ],
    actionSteps: [
      "Identify one ideal collaboration partner",
      "Draft 3 co-creation ideas",
      "Send your collaboration pitch",
      "Schedule and plan the collaboration",
      "Promote the co-created content to both audiences",
    ],
    optionalPost:
      "Co-creating with an amazing partner today. Collaboration multiplies your brand's reach.",
  },
  {
    title: "Build Your Dream List (Clients, Partners, Platforms)",
    objective:
      "Get strategic about who you want to work with — create a target list of dream clients, partners, and platforms.",
    whyItMatters:
      "A dream list turns vague ambition into focused action. You can't attract what you haven't named.",
    workSummary: [
      "List 10 dream clients you'd love to work with",
      "List 5 dream partners for collaboration",
      "List 3 dream platforms (podcasts, publications, stages)",
    ],
    aiPrompt:
      "My brand positioning is [statement] and I serve [audience]. Help me brainstorm 10 dream clients, 5 collaboration partners, and 3 media platforms I should target. For each, suggest one specific action to get on their radar.",
    reflectionPrompts: [
      "Are my dream clients aligned with my values and positioning?",
      "What's one step I could take toward my #1 dream client this week?",
      "Am I thinking big enough?",
    ],
    actionSteps: [
      "Write your dream client list (10 names/companies)",
      "Write your dream partner list (5 names)",
      "Write your dream platform list (3 targets)",
      "Choose one person/company and take one outreach action",
      "Review and update your dream list monthly",
    ],
    optionalPost:
      "Built my dream list today. Name your targets — then take aim.",
  },
  {
    title: "Launch a 7-Day Brand-Aligned Challenge",
    objective:
      "Create a short challenge that engages your audience, demonstrates your expertise, and grows your community.",
    whyItMatters:
      "Challenges create momentum, community, and content — all at once. They're a brand-building accelerator.",
    workSummary: [
      "Design a 7-day challenge aligned with your content pillars",
      "Create daily prompts and a simple participation mechanism",
      "Announce and launch the challenge",
    ],
    aiPrompt:
      "Design a 7-day personal branding challenge for my audience of [persona]. Each day should have a theme, a 10-minute action, and a shareable prompt. Align with my content pillars: [pillars]. Include an announcement post.",
    reflectionPrompts: [
      "Is this challenge genuinely valuable or just engagement bait?",
      "Can I commit to showing up daily for 7 days?",
      "How will I keep participants engaged throughout?",
    ],
    actionSteps: [
      "Outline your 7-day challenge themes",
      "Write daily prompts and actions",
      "Create a hashtag for participants",
      "Publish your announcement post",
      "Engage with every participant daily",
    ],
    optionalPost:
      "Launching my 7-day brand challenge! Join me — link in comments. #BrandAuthorityChallenge",
  },
  {
    title: "Build & Launch Your Personal Content Calendar",
    objective:
      "Create a 30-day content calendar so you never wonder what to post — consistency becomes automatic.",
    whyItMatters:
      "A content calendar removes daily decision fatigue and ensures your brand shows up consistently.",
    workSummary: [
      "Map 30 days of content using your 3 pillars",
      "Assign formats: posts, articles, videos, stories",
      "Schedule or batch-create your first week",
    ],
    aiPrompt:
      "Create a 30-day content calendar for my personal brand. Content pillars: [pillars]. Posting frequency: [X times/week]. Platforms: [LinkedIn, etc.]. Include topic, format, and hook for each post.",
    reflectionPrompts: [
      "Does my calendar balance value, personality, and promotion?",
      "Am I being realistic about my posting capacity?",
      "Which content types get the most engagement from my audience?",
    ],
    actionSteps: [
      "Create your 30-day content calendar",
      "Use the AI prompt to generate topic ideas",
      "Batch-write your first week's content",
      "Schedule posts using a tool or manual calendar",
      "Review and adjust based on engagement after 2 weeks",
    ],
    optionalPost:
      "Built my 30-day content calendar today. Consistency is a system, not a personality trait.",
  },
  {
    title: "Craft Your Signature Offer",
    objective:
      "Define the one offer that encapsulates your brand value — what you sell and why someone should buy from you.",
    whyItMatters:
      "A signature offer turns your brand into a business. It answers the question: 'How can I work with you?'",
    workSummary: [
      "Define your offer: what it is, who it's for, and the transformation it delivers",
      "Price it based on value, not time",
      "Write a compelling offer description",
    ],
    aiPrompt:
      "Help me craft my signature offer. My expertise: [area]. My audience: [persona]. My differentiator: [angle]. Include: offer name, target client, transformation promise, deliverables, and a compelling description under 200 words.",
    reflectionPrompts: [
      "Does my offer solve a real, urgent problem?",
      "Is the transformation clear and compelling?",
      "Would I buy this offer at this price?",
    ],
    actionSteps: [
      "Define your offer name and transformation promise",
      "List deliverables and timeline",
      "Write your offer description",
      "Set your pricing based on value delivered",
      "Add your offer to your website or LinkedIn",
    ],
    optionalPost:
      "Crafted my signature offer today. A brand without an offer is just a hobby.",
  },
  {
    title: "Build Your Brand Performance Tracker",
    objective:
      "Create a system to measure your brand growth — tracking the metrics that matter for long-term momentum.",
    whyItMatters:
      "What gets measured gets managed. A performance tracker keeps you accountable and shows your ROI.",
    workSummary: [
      "Define 5–7 brand KPIs (followers, engagement, inbound leads, speaking invites)",
      "Set up a simple tracking spreadsheet or dashboard",
      "Record your baseline numbers today",
    ],
    aiPrompt:
      "Help me create a personal brand performance tracker. My goals are [goals]. Suggest 7 KPIs I should track monthly, a simple spreadsheet structure, and benchmarks for what 'good' looks like in my industry.",
    reflectionPrompts: [
      "What metrics actually indicate brand growth for me?",
      "Am I tracking vanity metrics or meaningful ones?",
      "What was my biggest win over these 30 days?",
    ],
    actionSteps: [
      "List your 7 brand KPIs",
      "Record your baseline numbers today",
      "Set up a monthly tracking spreadsheet",
      "Schedule a monthly brand review on your calendar",
      "Celebrate your 30-day journey — you've built something real",
    ],
    optionalPost:
      "30 days done. Built my brand performance tracker and the results speak for themselves. Here's what changed. #BrandAuthorityChallenge #JeromeJoseph",
  },
];

function buildDay(dayNumber: number): DayContent {
  const data = DAYS[dayNumber - 1];
  const phase = getPhaseForDay(dayNumber).id as PhaseId;

  return {
    dayNumber,
    title: data.title,
    phase,
    objective: data.objective,
    whyItMatters: data.whyItMatters,
    workSummary: data.workSummary,
    aiPrompts: [{ label: "AI Power-Up Prompt", prompt: data.aiPrompt }],
    reflectionPrompts: data.reflectionPrompts,
    actionSteps: data.actionSteps,
    optionalPost: data.optionalPost,
    hashtags: ["#BrandAuthorityChallenge", "#JeromeJoseph", "#PersonalBrand"],
    tomorrowPreview:
      dayNumber < 30
        ? `Day ${dayNumber + 1} – ${DAYS[dayNumber].title}`
        : "Congratulations — you've completed the 30-day journey!",
  };
}

function main() {
  const daysDir = path.join(OUTPUT_DIR, "days");
  fs.mkdirSync(daysDir, { recursive: true });

  const allChunks: {
    id: string;
    bookSlug: string;
    dayNumber: number;
    section: string;
    text: string;
  }[] = [];

  for (let day = 1; day <= 30; day++) {
    const content = buildDay(day);
    const fileName = `day-${String(day).padStart(2, "0")}.json`;
    fs.writeFileSync(
      path.join(daysDir, fileName),
      JSON.stringify(content, null, 2),
    );

    const sections: [string, string][] = [
      ["objective", content.objective],
      ["whyItMatters", content.whyItMatters],
      ["workSummary", content.workSummary.join(" ")],
      ["aiPrompt", content.aiPrompts[0].prompt],
      ["actionSteps", content.actionSteps.join(" ")],
    ];

    for (const [section, text] of sections) {
      allChunks.push({
        id: `day-${day}-${section}`,
        bookSlug: "30-day-ai-personal-brand-plan",
        dayNumber: day,
        section,
        text,
      });
    }

    console.log(`Generated ${fileName}`);
  }

  const bookMeta = {
    slug: "30-day-ai-personal-brand-plan",
    title: "The 30-Day AI Personal Brand Plan",
    tagline: "Build Influence, Visibility & Authority — One Day at a Time",
    description:
      "An action-based transformation guide with 30 daily steps to build your personal brand using AI — one intentional day at a time.",
    totalDays: 30,
    status: "available",
    durationLabel: "30 days · 10–15 min/day",
    author: "Dr. Jerome Joseph",
    publisher: "Global Brand Academy Pte Ltd",
    coverGradient: "from-amber-500 via-orange-600 to-rose-700",
    phases: [
      { id: "clarity", name: "Clarity", days: [1, 5] },
      { id: "foundation", name: "Foundation", days: [6, 10] },
      { id: "visibility", name: "Visibility", days: [11, 15] },
      { id: "authority", name: "Authority", days: [16, 20] },
      { id: "momentum", name: "Momentum", days: [21, 30] },
    ],
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "book.json"),
    JSON.stringify(bookMeta, null, 2),
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "chunks.json"),
    JSON.stringify(allChunks, null, 2),
  );

  console.log(`\nDone. ${allChunks.length} chunks written.`);
}

main();
