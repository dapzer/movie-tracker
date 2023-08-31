import { SearchResponse } from '@/types/SearchResponse';
import { UiCard } from '@/components/ui/card/UiCard';
import { ContentNames } from '@/types/Enums';
import { LinkToDetails } from '@/components/core/details/link-to-details/LinkToDetails';

interface SearchResultPersonProps {
  personData: SearchResponse.ResultItem;
}

export const SearchResultPerson = (props: SearchResultPersonProps) => {
  const { personData } = props;

  return (
    <UiCard link={`details/${ContentNames.Person}/${personData.id}`} title={personData.name} image={personData.profile_path}>
      <LinkToDetails mediaId={personData.id} mediaType={ContentNames.Person} />
    </UiCard>
  );
};
