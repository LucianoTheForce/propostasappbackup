import ProposalClientPage from './client-page'

export default function ProposalPage({ params }: { params: { slug: string } }) {
  return <ProposalClientPage slug={params.slug} />
}