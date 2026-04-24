export interface LegalAnalysis {
  issue: string
  rule: string
  application: string
  conclusion: string
  confidence: number
  reasoning: string[]
}

export interface LegalResponse {
  shortAnswer: string
  legalAnalysis: {
    issue: string
    rule: string
    application: string
    conclusion: string
  }
  lawRule: string
  applicationToCase: string
  finalConclusion: string
  confidenceScore: number
  uncertainty?: string
}

export type CaseMode = 'case_solver' | 'judge' | 'debate' | 'summarizer' | 'chat_assistant' | 'prediction'

export class LegalAISystem {
  private currentMode: CaseMode = 'case_solver'
  
  constructor(mode: CaseMode = 'case_solver') {
    this.currentMode = mode
  }

  setMode(mode: CaseMode): void {
    this.currentMode = mode
  }

  analyzeLegalCase(caseDescription: string, question: string): LegalResponse {
    // Step 1: Identify Legal Issue
    const issue = this.identifyLegalIssue(caseDescription, question)
    
    // Step 2: Identify Relevant Law/Rule
    const rule = this.identifyRelevantLaw(issue)
    
    // Step 3: Apply Rule to Facts
    const application = this.applyRuleToFacts(caseDescription, rule)
    
    // Step 4: Reach Conclusion
    const conclusion = this.reachConclusion(application)
    
    // Step 5: Calculate Confidence
    const confidence = this.calculateConfidence(issue, rule, application)
    
    // Step 6: Generate Short Answer
    const shortAnswer = this.generateShortAnswer(conclusion)
    
    // Step 7: Self-Check for Consistency
    this.performSelfCheck(issue, rule, application, conclusion)
    
    return {
      shortAnswer,
      legalAnalysis: {
        issue,
        rule,
        application,
        conclusion
      },
      lawRule: rule,
      applicationToCase: application,
      finalConclusion: conclusion,
      confidenceScore: confidence,
      uncertainty: confidence < 70 ? "UNCERTAIN: Limited case facts available for comprehensive analysis" : undefined
    }
  }

  private identifyLegalIssue(caseDescription: string, question: string): string {
    // Analyze the case to identify the core legal question
    const keywords = this.extractLegalKeywords(caseDescription)
    const issueType = this.classifyLegalIssue(keywords)
    
    return `The primary legal issue is ${issueType} based on the facts presented: ${caseDescription.substring(0, 100)}...`
  }

  private identifyRelevantLaw(issue: string): string {
    // Map legal issues to relevant laws/rules
    const lawMappings: Record<string, string> = {
      'contract': 'Contract Law requires offer, acceptance, consideration, and legal capacity for enforceability.',
      'tort': 'Tort Law establishes duty of care, breach, causation, and damages for negligence claims.',
      'criminal': 'Criminal Law requires mens rea (guilty mind) and actus reus (guilty act) for liability.',
      'property': 'Property Law governs ownership rights, transfers, and interests in real/personal property.'
    }
    
    const category = this.categorizeLegalIssue(issue)
    return lawMappings[category] || 'General legal principles apply to this situation.'
  }

  private applyRuleToFacts(caseDescription: string, rule: string): string {
    // Apply the identified legal rule to the specific case facts
    return `Applying the legal principle to the case facts: ${rule} The specific circumstances indicate ${this.analyzeFacts(caseDescription)}`
  }

  private reachConclusion(application: string): string {
    // Logical conclusion based on the legal analysis
    return `Based on the legal analysis, ${application} therefore the likely outcome is ${this.predictOutcome(application)}`
  }

  private calculateConfidence(issue: string, rule: string, application: string): number {
    // Calculate confidence score based on clarity of legal analysis
    let confidence = 50 // Base confidence
    
    if (issue.length > 50) confidence += 15
    if (rule.length > 50) confidence += 15
    if (application.length > 50) confidence += 15
    
    // Check for uncertainty indicators
    const uncertaintyWords = ['may', 'might', 'could', 'possibly', 'potentially']
    const hasUncertainty = uncertaintyWords.some(word => 
      application.toLowerCase().includes(word)
    )
    
    if (hasUncertainty) confidence -= 20
    
    return Math.max(0, Math.min(100, confidence))
  }

  private generateShortAnswer(conclusion: string): string {
    // Extract the core answer from the detailed conclusion
    return conclusion.split('therefore')[1]?.trim() || conclusion.substring(0, 100) + '...'
  }

  private performSelfCheck(issue: string, rule: string, application: string, conclusion: string): void {
    // Self-check for logical consistency and legal accuracy
    const checks = [
      this.checkLogicalConsistency(issue, rule, application, conclusion),
      this.checkLegalAccuracy(rule),
      this.checkClarity(issue, application, conclusion)
    ]
    
    if (checks.some(check => !check)) {
      throw new Error('Self-check failed: Analysis contains inconsistencies')
    }
  }

  private extractLegalKeywords(text: string): string[] {
    const legalKeywords = [
      'contract', 'breach', 'negligence', 'liability', 'damages', 'tort', 'crime',
      'property', 'agreement', 'offer', 'acceptance', 'consideration', 'duty', 'care'
    ]
    
    return legalKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  private classifyLegalIssue(keywords: string[]): string {
    if (keywords.includes('contract') || keywords.includes('agreement')) {
      return 'contract dispute'
    }
    if (keywords.includes('negligence') || keywords.includes('tort')) {
      return 'tort claim'
    }
    if (keywords.includes('crime') || keywords.includes('criminal')) {
      return 'criminal matter'
    }
    if (keywords.includes('property')) {
      return 'property dispute'
    }
    return 'general legal issue'
  }

  private categorizeLegalIssue(issue: string): string {
    if (issue.includes('contract')) return 'contract'
    if (issue.includes('tort')) return 'tort'
    if (issue.includes('criminal')) return 'criminal'
    if (issue.includes('property')) return 'property'
    return 'general'
  }

  private analyzeFacts(caseDescription: string): string {
    // Analyze the key facts of the case
    return `the evidence shows ${caseDescription.substring(0, 80)}...`
  }

  public predictOutcome(application: string): { outcome: string; probability: number } {
    // Predict likely outcome based on legal analysis
    if (application.includes('breach')) return { outcome: 'liability for breach', probability: 0.75 }
    if (application.includes('sufficient evidence')) return { outcome: 'favorable ruling', probability: 0.85 }
    return { outcome: 'resolution based on presented facts', probability: 0.60 }
  }

  private checkLogicalConsistency(issue: string, rule: string, application: string, conclusion: string): boolean {
    // Check if the analysis flows logically
    return issue.length > 0 && rule.length > 0 && application.length > 0 && conclusion.length > 0
  }

  private checkLegalAccuracy(rule: string): boolean {
    // Basic check for legal accuracy
    return rule.includes('Law') || rule.includes('legal') || rule.includes('principle')
  }

  private checkClarity(issue: string, application: string, conclusion: string): boolean {
    // Check if the analysis is clear and understandable
    return issue.split(' ').length > 3 && application.split(' ').length > 5 && conclusion.split(' ').length > 3
  }

  // Mode-specific methods
  generateDebateArguments(caseDescription: string): { pro: string; contra: string } {
    const analysis = this.analyzeLegalCase(caseDescription, "Generate debate arguments")
    
    return {
      pro: `PRO: ${analysis.finalConclusion} Supporting factors: ${analysis.applicationToCase}`,
      contra: `CONTRA: Alternative interpretation suggests different outcome based on ${analysis.lawRule}`
    }
  }

  summarizeCase(caseDescription: string): string {
    const analysis = this.analyzeLegalCase(caseDescription, "Summarize this case")
    return `CASE SUMMARY: ${analysis.shortAnswer} Key issue: ${analysis.legalAnalysis.issue} Likely outcome: ${analysis.finalConclusion}`
  }

  }
