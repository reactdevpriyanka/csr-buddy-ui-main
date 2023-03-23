import tags from '__mock__/tags/customer+output';
import availableTags from '__mock__/tags/system+output';

const updateCustomerTags = jest.fn();

const mutate = jest.fn();

export default function mockUseTags() {
  return {
    data: tags,
    tags,
    availableTags,
    updateCustomerTags,
    mutate,
    error: null,
    isValidating: false,
  };
}

mockUseTags.updateCustomerTags = updateCustomerTags;

mockUseTags.mutate = mutate;
