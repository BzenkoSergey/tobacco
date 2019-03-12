import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				redirectTo: 'resources',
				pathMatch: 'full'
			},
			{
				path: 'resources',
				loadChildren: './containers/resources/resources.module#ResourcesModule',
				data: {
					breadcrumb: 'Resources'
				}
			},
			{
				path: 'resources-groups',
				loadChildren: './containers/resources-groups/resources-groups.module#ResourcesGroupsModule',
				data: {
					breadcrumb: 'Resources Groups'
				}
			},
			{
				path: 'resources-items',
				loadChildren: './containers/resources-items/resources-items.module#ResourcesItemsModule',
				data: {
					breadcrumb: 'Resources Items'
				}
			},
			{
				path: 'categories',
				loadChildren: './containers/categories/categories.module#CategoriesModule',
				data: {
					breadcrumb: 'Categories'
				}
			},
			{
				path: 'companies',
				loadChildren: './containers/companies/companies.module#CompaniesModule',
				data: {
					breadcrumb: 'Companies'
				}
			},
			{
				path: 'unit-lines',
				loadChildren: './containers/unit-lines/unit-lines.module#UnitLinesModule',
				data: {
					breadcrumb: 'Unit Lines'
				}
			},
			{
				path: 'unit-mixes',
				loadChildren: './containers/unit-mixes/unit-mixes.module#UnitMixesModule',
				data: {
					breadcrumb: 'Unit Mixes'
				}
			},
			{
				path: 'unit-attributes',
				loadChildren: './containers/unit-attributes/unit-attributes.module#UnitAttributesModule',
				data: {
					breadcrumb: 'Unit Attributes'
				}
			},
			{
				path: 'units',
				loadChildren: './containers/units/units.module#UnitsModule',
				data: {
					breadcrumb: 'Units'
				}
			},
			{
				path: 'unit-items',
				loadChildren: './containers/units-items/units-items.module#UnitsItemsModule',
				data: {
					breadcrumb: 'Unit items'
				}
			},
			{
				path: 'schemes',
				loadChildren: './containers/schemes/schemes.module#SchemesModule',
				data: {
					breadcrumb: 'Schemes'
				}
			},
			{
				path: 'schemes-groups',
				loadChildren: './containers/schemes-groups/schemes-groups.module#SchemesGroupsModule',
				data: {
					breadcrumb: 'Scheme Groups'
				}
			},
			{
				path: 'images',
				loadChildren: './containers/images/images.module#ImagesModule',
				data: {
					breadcrumb: 'Images'
				}
			},
			{
				path: 'wl',
				loadChildren: './containers/wl/wl.module#WlModule',
				data: {
					breadcrumb: 'WL'
				}
			},
			{
				path: 'wiki',
				loadChildren: './containers/wiki/wiki.module#WikiModule',
				data: {
					breadcrumb: 'Wiki'
				}
			},
			{
				path: 'seo',
				loadChildren: './containers/seo/seo.module#SeoModule',
				data: {
					breadcrumb: 'Seo'
				}
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			paramsInheritanceStrategy: 'always',
			anchorScrolling: 'enabled',
			scrollOffset: [0, 64],
			scrollPositionRestoration: 'enabled'
		})
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule {}
