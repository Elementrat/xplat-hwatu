import s from "./GlobalSearch.module.css"
import strings from "./GlobalSearch.strings"

const GlobalSearch = () => {
  return <div className={s.globalSearch}>{strings.SEARCH_PLACEHOLDER}</div>
}

export default GlobalSearch;