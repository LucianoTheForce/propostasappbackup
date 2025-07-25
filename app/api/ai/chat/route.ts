import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are an AI assistant specialized in helping create and edit business proposals for THE FORCE, a creative agency. You have expertise in:

1. Writing compelling proposal content
2. Improving existing text for clarity and professionalism
3. Creating technical specifications
4. Generating pricing sections
5. Translating content between Portuguese and English
6. Creating executive summaries
7. Formatting content appropriately

Always maintain THE FORCE's professional tone while being creative and engaging. When modifying content, provide both the explanation and the improved text.

Available commands:
- "Generate [section]" - Create new content
- "Rewrite [text]" - Improve existing content
- "Translate to [language]" - Translate content
- "Add technical specs for [item]" - Add technical details
- "Create summary" - Generate executive summary
- "Format as [style]" - Change formatting`

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    // Build the conversation with context
    const systemMessage = {
      role: 'system' as const,
      content: `${SYSTEM_PROMPT}

Current proposal context:
- Proposal Name: ${context.proposalName || 'N/A'}
- Client: ${context.client || 'N/A'}
- Selected Text: ${context.selectedText || 'None'}

Current content preview:
${context.currentContent ? context.currentContent.substring(0, 500) + '...' : 'No content yet'}`
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        systemMessage,
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const assistantMessage = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Check if this is a content modification request
    let action = 'chat'
    let newContent = null

    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
    
    if (userMessage.includes('rewrite') || userMessage.includes('generate') || userMessage.includes('modify')) {
      action = 'modify_content'
      // In a real implementation, you would parse the AI response to extract the new content
      // For now, we'll just indicate that content should be modified
    }

    return NextResponse.json({
      content: assistantMessage,
      action,
      newContent
    })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}