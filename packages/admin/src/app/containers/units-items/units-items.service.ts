export class UnitsItemsService {
	static fetchProcessedItems(): any {
		return [
			{
				$sort: {
					version: -1
				}
			},
			{
				$group : {
					_id: '$url',
					items: {
						$push: '$$ROOT'
					},
					ids: {
						$push: {
							$toString: '$$ROOT._id'
						}
					}
				}
			},
			{
				$lookup: {
					from: 'unit-item',
					localField: 'ids',
					foreignField: 'itemProcessedId',
					as: 'unitItems'
				}
			},
			{
				$addFields : {
					unitItem: {
						$arrayElemAt: ['$unitItems', 0]
					}
				}
			},
			{
				$addFields : {
					unitItemId: {
						'$toObjectId': '$unitItem.itemProcessedId'
					}
				}
			},
			{
				$lookup: {
					from: 'resource-processed-item',
					localField: 'unitItemId',
					foreignField: '_id',
					as: 'assigned'
				}
			},
			{
				$addFields : {
					assigned: {
						$arrayElemAt: ['$assigned', -1]
					},
					root: {
						$arrayElemAt: ['$items', 0]
					}
				}
			},
			{
				$addFields : {
					ass: {
						$objectToArray: {
							$ifNull: ['$assigned', {}]
						}
					},
					ass2: {
						$objectToArray: {
							$ifNull: ['$root', {}]
						}
					}
				}
			},
			{
				$addFields : {
					ass3: {
						$filter: {
							input: '$ass',
							as: 'prop',
							cond: {
								$and: [
									{
										$ne: ['$$prop.k', 'version']
									},
									{
										$ne: ['$$prop.k', '_id']
									}
								]
							}
						}
					},
					ass23: {
						$filter: {
							input: '$ass2',
							as: 'prop',
							cond: {
								$and: [
									{
										$ne: ['$$prop.k', 'version']
									},
									{
										$ne: ['$$prop.k', '_id']
									}
								]
							}
						}
					}
				}
			},
			{
				$addFields : {
					size: {
						'$size': {
							'$setIntersection': [
								'$ass3',
								'$ass23'
							]
						}
					},
					size3: {
						'$size': '$ass3'
					}
				}
			},
			{
				$addFields : {
					hasUpdates: {
						$ne: ['$size3', '$size']
					}
				}
			},
			{
				$replaceRoot: {
					newRoot: {
						items2: 'items',
						items: '$items',
						item: {
							$arrayElemAt: ['$items', 0]
						},
						assigned: '$assigned',
						unitItem: '$unitItem',
						hasUpdates: '$hasUpdates'
					}
				}
			}
		];
	}
}
