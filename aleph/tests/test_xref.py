import json
from unittest import skip  # noqa

from aleph.core import db
from aleph.tests.util import TestCase
from aleph.logic.xref import xref_collection
from aleph.model import Collection, Match


class XrefTestCase(TestCase):

    def setUp(self):
        super(XrefTestCase, self).setUp()
        self.user = self.create_user()
        self.coll_a = Collection.create({
            'label': 'Collection A',
            'foreign_id': 'collA'
        }, role=self.user)
        self.coll_b = Collection.create({
            'label': 'Collection B',
            'foreign_id': 'collB'
        }, role=self.user)
        db.session.commit()

    def test_xref(self):
        _, headers = self.login(foreign_id=self.user.foreign_id)
        url = '/api/2/entities'

        entity = {
            'schema': 'Person',
            'name': 'Carlos Danger',
            'collection_id': self.coll_a.id,
            'data': {
                'nationality': 'US'
            }
        }
        self.client.post(url, data=json.dumps(entity),
                         headers=headers,
                         content_type='application/json')
        entity = {
            'schema': 'Person',
            'name': 'Carlos Danger, Jr.',
            'collection_id': self.coll_b.id,
            'data': {
                'nationality': 'US'
            }
        }
        self.client.post(url, data=json.dumps(entity),
                         headers=headers,
                         content_type='application/json')
        entity = {
            'schema': 'Company',
            'name': 'Carlos Danger, Ltd',
            'collection_id': self.coll_b.id,
            'data': {
                'nationality': 'GB'
            }
        }
        self.client.post(url, data=json.dumps(entity),
                         headers=headers,
                         content_type='application/json')
        entity = {
            'schema': 'Person',
            'name': 'Pure Risk',
            'collection_id': self.coll_b.id,
            'data': {
                'nationality': 'US'
            }
        }
        self.client.post(url, data=json.dumps(entity),
                         headers=headers,
                         content_type='application/json')

        q = db.session.query(Match)
        assert 0 == q.count(), q.count()

        xref_collection(self.coll_a)

        q = db.session.query(Match)
        assert 2 == q.count(), q.count()
