import { Component, OnInit } from '@angular/core';
import { Columns, Config } from 'ngx-easy-table';
import { DialogRef, ModalComponent } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { DialogPreset } from 'ngx-modialog-7/plugins/vex/ngx-modialog-7-plugins-vex';
import { ClipboardItem, IManipulate, Manipulate2Icon } from '../../../@dataflow/extra';
import { TaskService } from './tasks.service';

// TODO: deprecate or reconstruct it
@Component({
	selector: 'app-manager-tasks-dialog',
	template: `
		<nb-card class="dialog-card">
			<nb-card-header>
				<nb-action>
					<nb-icon icon="email-outline" class="clipboard-icon"></nb-icon>
				</nb-action>
				Tasks
			</nb-card-header>
			<nb-card-body>
				<nb-accordion multi>
					<!-- <nb-accordion-item *ngIf="orderSize !== 0"> -->
					<nb-accordion-item>
						<nb-accordion-item-header>
							Order
						</nb-accordion-item-header>
						<nb-accordion-item-body>
							<ngx-table
								#orderTable
								[configuration]="conf"
								[data]="orderData"
								id="order"
								[columns]="columns"
							>
								<ng-template let-row let-rowIdx="index">
									<td><nb-icon [icon]="manipulate2Icon(row.oper)"></nb-icon></td>
									<td>{{ row.srcRemote }}</td>
									<td>{{ row.srcItem.Path }}</td>
									<td>{{ row.dst.remote }}</td>
									<td>{{ row.dst.path }}</td>
								</ng-template>
							</ngx-table>
						</nb-accordion-item-body>
					</nb-accordion-item>

					<nb-accordion-item *ngIf="failSize !== 0">
						<nb-accordion-item-header>
							Failure
							<button nbButton ghost status="warning" class="right" (click)="retryFailure()">
								Retry
							</button>
							<button nbButton ghost status="danger" class="rightest" (click)="removeFailure()">
								Remove
							</button>
						</nb-accordion-item-header>
						<nb-accordion-item-body>
							<ngx-table
								#failTasksTable
								[configuration]="conf"
								[data]="failData"
								id="fail"
								[columns]="columns"
							>
								<ng-template let-row let-rowIdx="index">
									<td><nb-icon [icon]="manipulate2Icon(row.oper)"></nb-icon></td>
									<td>{{ row.srcRemote }}</td>
									<td>{{ row.srcItem.Path }}</td>
									<td>{{ row.dst.remote }}</td>
									<td>{{ row.dst.path }}</td>
								</ng-template>
							</ngx-table>
						</nb-accordion-item-body>
					</nb-accordion-item>
				</nb-accordion>
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			nb-card-footer,
			nb-card-header {
				display: flex;
			}
			.dialog-card {
				margin: calc(-1em - 3px);
			}
			.clipboard-icon {
				font-size: 1.5rem;
				margin-right: 0.5rem;
			}
			.right {
				margin-left: auto;
			}
			.rightest {
				margin-right: auto;
			}
		`,
	],
})
export class TasksDialogComponent implements OnInit, ModalComponent<DialogPreset> {
	constructor(private service: TaskService, public dialog: DialogRef<DialogPreset>) {
		this.context = dialog.context;
	}
	public context: DialogPreset;
	public conf: Config;
	public columns: Columns[] = [
		{ key: 'oper', title: '', width: '3%' },
		{ key: 'srcRemote', title: 'Source Remote', width: '10%' },
		{ key: 'srcItem.Path', title: 'Source Path', width: '35%' },
		{ key: 'dst.remote', title: 'Destination Remote', width: '10%' },
		{ key: 'dst.path', title: 'Destination Path', width: '35%' },
	];

	orderSize = 0;
	orderData: ClipboardItem[] = [];

	failSize = 0;
	failData: ClipboardItem[] = [];

	public manipulate2Icon = Manipulate2Icon;

	ngOnInit() {
		this.service.detail$.getOutput().subscribe(x => {
			if (x[1].length !== 0) return;
			const order = x[0].order;
			const fail = x[0].failure;
			this.orderSize = order.size;
			this.failSize = fail.size;
			this.orderData = order.values;
			this.failData = fail.values;
		});
	}

	retryFailure() {
		this.service.retryFailureTasks();
	}

	removeFailure() {
		this.service.removeFailureTasks();
	}
}
