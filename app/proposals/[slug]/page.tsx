import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProposalTemplate from '@/app/proposal-template'

export default async function ProposalPage({ params }: { params: { slug: string } }) {
  // Fetch proposal data from Supabase
  const { data: proposal, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !proposal) {
    notFound()
  }

  // Track view if not already viewed
  if (proposal.status === 'sent') {
    await supabase
      .from('proposals')
      .update({ status: 'viewed' })
      .eq('id', proposal.id)
  }

  // For now, we'll use the existing template
  // Later, we'll make this dynamic based on proposal.content_json
  return <ProposalTemplate />
}