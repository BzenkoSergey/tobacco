import { JobConstructor } from './jobs/job.interface';
import { HttpJob } from './jobs/http.job';
import { TJob } from './jobs/t.job';
import { TJob2 } from './jobs/t2.job';
import { TJob3 } from './jobs/t3.job';
import { NoneJob } from './jobs/none.job';
import { RepeatJob } from './jobs/repeat.job';

import { DBExtCreateJob } from './jobs/db/ext-create.job';
import { DBExtUpdateJob } from './jobs/db/ext-update.job';
import { DBExtRemoveJob } from './jobs/db/ext-remove.job';
import { DBExtGetJob } from './jobs/db/ext-get.job';
import { DBExtGetListJob } from './jobs/db/ext-get-list.job';
import { DBGetJob } from './jobs/db/get.job';
import { DBGetListJob } from './jobs/db/get-list.job';
import { DBCreateJob } from './jobs/db/create.job';
import { DBUpdateJob } from './jobs/db/update.job';
import { DBRemoveJob } from './jobs/db/remove.job';

import { UtilsFilterJob } from './jobs/utils/filter.job';
import { UtilsFilterPropsJob } from './jobs/utils/filter-props.job';

import { RepeatManyJob } from './jobs/repeat-many.job';
import { RepeatChildJob } from './jobs/repeat-child.job';
import { DomifyJob } from './jobs/scrap/domify.job';
import { DomScrapJob } from './jobs/scrap/dom-scrap.job';
import { LinkerJob } from './jobs/scrap/linker.job';
import { IngoreLinksJob } from './jobs/scrap/ignore-links.job';
import { VersionJob } from './jobs/version.job';
import { DelayJob } from './jobs/delay.job';

import { ProcessesJob } from './jobs/processes/processes.job';

import { AggregateJob } from './jobs/product/aggregate.job';
import { CompanyJob } from './jobs/product/company.job';
import { ProductLineJob } from './jobs/product/product-line.job';
import { ProductJob } from './jobs/product/product.job';
import { ProductAttributesJob } from './jobs/product/product-attribute.job';
import { ProcessedQualityJob } from './jobs/product/processed-quality.job';
import { AssignedItemsJob } from './jobs/product/assigned-items.job';
import { ItemsDelayJob } from './jobs/product/items-delay.job';
import { CheckAutoAggregationJob } from './jobs/product/check-auto-aggregation.job';
import { NotificationJob } from './jobs/product/notification.job';

import { ImageDownloadJob } from './jobs/images/download.job';
import { ImageExternlDownloadJob } from './jobs/images/external.job';
import { ImageFilterJob } from './jobs/images/filter.job';
import { ImageNamesJob } from './jobs/images/names.job';
import { ImageResizeJob } from './jobs/images/resize.job';
import { ImageSyncJob } from './jobs/images/sync.job';
import { ImageUploadJob } from './jobs/images/upload.job';
import { ImageGetJob } from './jobs/images/get.job';

import { DbConfigsJob } from './jobs/wl/db-configs.job';
import { GetAllJob } from './jobs/wl/get-all.job';
import { MoveJob } from './jobs/wl/move.job';
import { MoveOneJob } from './jobs/wl/move-one.job';

export enum JobRegister {
	NONE = 'NONE',
	HTTP = 'HTTP',
	T = 'T',
	T2 = 'T2',
	T3 = 'T3',
	REPEAT = 'REPEAT',
	VERSION = 'VERSION',
	DELAY = 'DELAY',

	PRODUCT_COMPANY = 'PRODUCT_COMPANY',
	PRODUCT_LINE = 'PRODUCT_LINE',
	PRODUCT = 'PRODUCT',
	PRODUCT_ATTRIBUTES = 'PRODUCT_ATTRIBUTES',
	PRODUCT_PROCESSED_QUALITY = 'PRODUCT_PROCESSED_QUALITY',
	PRODUCT_AGGREGATE = 'PRODUCT_AGGREGATE',
	PRODUCT_ASSIGNED_ITEMS = 'PRODUCT_ASSIGNED_ITEMS',
	PRODUCT_ITEMS_DELAY = 'PRODUCT_ITEMS_DELAY',
	PRODUCT_CHECK_AUTO_AGGREGATION = 'PRODUCT_CHECK_AUTO_AGGREGATION',
	PRODUCT_NOTIFICATION = 'PRODUCT_NOTIFICATION',

	UTILS_FILTER = 'UTILS_FILTER',
	UTILS_FILTER_PROPS = 'UTILS_FILTER_PROPS',

	DBEXT_CREATE = 'DBEXT_CREATE',
	DBEXT_UPDATE = 'DBEXT_UPDATE',
	DBEXT_REMOVE = 'DBEXT_REMOVE',
	DBEXT_GET = 'DBEXT_GET',
	DBEXT_GET_LIST = 'DBEXT_GET_LIST',
	DB_GET = 'DB_GET',
	DB_GET_LIST = 'DB_GET_LIST',
	DB_CREATE = 'DB_CREATE',
	DB_UPDATE = 'DB_UPDATE',
	DB_REMOVE = 'DB_REMOVE',

	IGNORE_LINKS = 'IGNORE_LINKS',
	REPEAT_MANY = 'REPEAT_MANY',
	REPEAT_CHILD = 'REPEAT_CHILD',
	DOMIFY = 'DOMIFY',
	DOM_SCRAP = 'DOM_SCRAP',
	LINKER = 'LINKER',
	PROCESSES = 'PROCESSES',

	IMG_DOWMLOAD = 'IMG_DOWMLOAD',
	IMG_EXTERNAL_DOWNLOAD = 'IMG_EXTERNAL_DOWNLOAD',
	IMG_FILTER = 'IMG_FILTER',
	IMG_NAMES = 'IMG_NAMES',
	IMG_RESIZE = 'IMG_RESIZE',
	IMG_SYNC = 'IMG_SYNC',
	IMG_UPLOAD = 'IMG_UPLOAD',
	IMG_GET = 'IMG_GET',

	WL_GET_ALL = 'WL_GET_ALL',
	WL_DB_CONFIGS = 'WL_DB_CONFIGS',
	WL_MOVE = 'WL_MOVE',
	WL_MOVE_ONE = 'WL_MOVE_ONE'
}

export namespace JobRegister {
	const map = new Map<JobRegister, JobConstructor>();
	map.set(JobRegister.IMG_DOWMLOAD, ImageDownloadJob);
	map.set(JobRegister.IMG_EXTERNAL_DOWNLOAD, ImageExternlDownloadJob);
	map.set(JobRegister.IMG_FILTER, ImageFilterJob);
	map.set(JobRegister.IMG_NAMES, ImageNamesJob);
	map.set(JobRegister.IMG_RESIZE, ImageResizeJob);
	map.set(JobRegister.IMG_SYNC, ImageSyncJob);
	map.set(JobRegister.IMG_UPLOAD, ImageUploadJob);
	map.set(JobRegister.IMG_GET, ImageGetJob);

	map.set(JobRegister.NONE, NoneJob);
	map.set(JobRegister.NONE, NoneJob);

	map.set(JobRegister.NONE, NoneJob);
	map.set(JobRegister.HTTP, HttpJob);
	map.set(JobRegister.T, TJob);
	map.set(JobRegister.T2, TJob2);
	map.set(JobRegister.T3, TJob3);
	map.set(JobRegister.REPEAT, RepeatJob);
	map.set(JobRegister.VERSION, VersionJob);
	map.set(JobRegister.DELAY, DelayJob);
	map.set(JobRegister.REPEAT_CHILD, RepeatChildJob);

	map.set(JobRegister.PRODUCT_COMPANY, CompanyJob);
	map.set(JobRegister.PRODUCT_LINE, ProductLineJob);
	map.set(JobRegister.PRODUCT, ProductJob);
	map.set(JobRegister.PRODUCT_ATTRIBUTES, ProductAttributesJob);
	map.set(JobRegister.PRODUCT_PROCESSED_QUALITY, ProcessedQualityJob);
	map.set(JobRegister.PRODUCT_AGGREGATE, AggregateJob);
	map.set(JobRegister.PRODUCT_ASSIGNED_ITEMS, AssignedItemsJob);
	map.set(JobRegister.PRODUCT_ITEMS_DELAY, ItemsDelayJob);
	map.set(JobRegister.PRODUCT_CHECK_AUTO_AGGREGATION, CheckAutoAggregationJob);
	map.set(JobRegister.PRODUCT_NOTIFICATION, NotificationJob);

	map.set(JobRegister.UTILS_FILTER, UtilsFilterJob);
	map.set(JobRegister.UTILS_FILTER_PROPS, UtilsFilterPropsJob);

	map.set(JobRegister.DBEXT_CREATE, DBExtCreateJob);
	map.set(JobRegister.DBEXT_UPDATE, DBExtUpdateJob);
	map.set(JobRegister.DBEXT_REMOVE, DBExtRemoveJob);
	map.set(JobRegister.DBEXT_GET, DBExtGetJob);
	map.set(JobRegister.DBEXT_GET_LIST, DBExtGetListJob);
	map.set(JobRegister.DB_GET, DBGetJob);
	map.set(JobRegister.DB_GET_LIST, DBGetListJob);
	map.set(JobRegister.DB_CREATE, DBCreateJob);
	map.set(JobRegister.DB_UPDATE, DBUpdateJob);
	map.set(JobRegister.DB_REMOVE, DBRemoveJob);

	map.set(JobRegister.IGNORE_LINKS, IngoreLinksJob);
	map.set(JobRegister.REPEAT_MANY, RepeatManyJob);
	map.set(JobRegister.DOMIFY, DomifyJob);
	map.set(JobRegister.DOM_SCRAP, DomScrapJob);
	map.set(JobRegister.LINKER, LinkerJob);
	map.set(JobRegister.PROCESSES, ProcessesJob);

	map.set(JobRegister.WL_DB_CONFIGS, DbConfigsJob);
	map.set(JobRegister.WL_GET_ALL, GetAllJob);
	map.set(JobRegister.WL_MOVE, MoveJob);
	map.set(JobRegister.WL_MOVE_ONE, MoveOneJob);

	export function getJob(name: JobRegister): JobConstructor {
		return map.get(name);
	}
}