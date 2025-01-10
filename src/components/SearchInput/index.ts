import { SearchInput } from "./SearchInput";
import { withSearchInput } from "./withSearchInput";

const ConnectedSearchInput = withSearchInput(SearchInput);

export { ConnectedSearchInput as SearchInput };
