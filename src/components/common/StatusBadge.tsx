import { useTranslation } from 'react-i18next'
import type { SectionStatus } from '@/types/models'
import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: SectionStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation()

  if (status === 'done') {
    return <Badge variant="success">{t('common.status.done')}</Badge>
  }
  if (status === 'in_progress') {
    return <Badge variant="warning">{t('common.status.in_progress')}</Badge>
  }
  return <Badge variant="muted">{t('common.status.empty')}</Badge>
}
