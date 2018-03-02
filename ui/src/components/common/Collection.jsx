import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getPath from 'src/util/getPath';
import { fetchCollection } from 'src/actions';
import { getCollection } from 'src/selectors';


class CollectionLabel extends Component {
  render() {
    const { collection, icon = true } = this.props;

    return (
      <React.Fragment>
        { collection.secret && icon && (<i className='fa fa-fw fa-lock' />) }
        { collection.label }
      </React.Fragment>
    );
  }
}

class CollectionLink extends Component {
  render() {
    const { collection, icon = true, className } = this.props;

    return (
      <Link to={getPath(collection.links.ui)} className={className}>
        <Collection.Label collection={collection} icon={icon} />
      </Link>
    );
  }
}

class CollectionLoad extends Component {
  componentDidMount() {
    this.fetchIfNeeded();
  }

  componentDidUpdate() {
    this.fetchIfNeeded();
  }

  fetchIfNeeded() {
    const { id, collection } = this.props;
    if (collection === undefined) {
      this.props.fetchCollection({ id });
    }
  }

  render() {
    const { collection, children, renderWhenLoading } = this.props;
    if (
      (collection === undefined || collection.isFetching)
      && renderWhenLoading !== undefined
    ) {
      return renderWhenLoading;
    } else {
      return children(collection);
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  collection: getCollection(state, ownProps.id),
});
CollectionLoad = connect(mapStateToProps, { fetchCollection })(CollectionLoad);

CollectionLoad.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  renderWhenLoading: PropTypes.node,
}

class Collection {
  static Label = CollectionLabel;
  static Link = CollectionLink;
  static Load = CollectionLoad;
}

export default Collection;
