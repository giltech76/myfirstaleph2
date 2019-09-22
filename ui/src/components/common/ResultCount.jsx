import React, { PureComponent } from 'react';
import { FormattedNumber, FormattedMessage } from 'react-intl';


class ResultCount extends PureComponent {
  render() {
    const { result } = this.props;
    if ((!result) || result.shouldLoad || result.isLoading) {
      return <FormattedMessage id="result.searching" defaultMessage="Searching..." />;
    }
    if (result.isError) {
      return <FormattedMessage id="result.error" defaultMessage="Error" />;
    }
    if (result.total_type === 'gte') {
      return (
        <FormattedMessage
          id="result.more_results"
          defaultMessage="More than {total} results"
          values={{
            total: <FormattedNumber value={result.total} />,
          }}
        />
      );
    }
    if (result.total === 0) {
      return <FormattedMessage id="result.none" defaultMessage="No results found" />;
    }
    if (result.total === 1) {
      return <FormattedMessage id="result.solo" defaultMessage="One result found" />;
    }
    return (
      <FormattedMessage
        id="result.results"
        defaultMessage="Found {total} results"
        values={{
          total: <FormattedNumber value={result.total} />,
        }}
      />
    );
  }
}

export default ResultCount;
