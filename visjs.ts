import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
declare var vis: any;
var network = null;
@Component({
    selector: 'app-vis',
    templateUrl: './vis.component.html',
    styleUrls: ['./vis.component.css'],
})
export class VisComponent implements OnInit {
    @ViewChild('siteConfigNetwork', { static: true, }) networkContainer: ElementRef;
    Device = [];
    Attack: any;
    Link: any;
    nodes: any;
    edges = [];
    attackArray = [];
    attack: any;
    constructor(private http: HttpClient, private data: DataService) {
    }
    ngOnInit() {
        this.mynodes();
        const myapi = `${environment.API_HOST}`
        this.http.get(myapi).subscribe(
            resp => {
                this.Link = resp;
                console.log(this.Link)
                this.Link.forEach(element => {
                    this.edges.push(
                        {
                            from: element.id,
                            to: element.id,
                            length: element.length
                        }
                    )
                });
                this.draw();
            }
        )
    }
    mynodes() {
        const api = `${environment.API_HOST}`
        this.http.get(api).subscribe(
            (resp: any) => {
                this.Device = resp;
                console.log(this.Device)
                this.nodes = new vis.DataSet(this.Device.map(element => {
                    return {
                        id: element.id,
                        label: element.name,
                        image: 'assets/images/' + element.type + '.png',
                        iconSize: [30, 30],
                        shape: 'image'
                    }
                })
                )
                this.draw();

            }
        )
    }
    draw() {
        var data = {
            nodes: this.nodes,
            edges: this.edges
        };
        var options = {
            interaction: {
                hover: true,
            },
            manipulation: {
                enabled: true
            },
            nodes: {
                color: '#ff0000',
                fixed: false,
                font: '14px arial black',
                scaling: {
                    label: true
                }
            }
        };
        network = new vis.Network(this.networkContainer.nativeElement, data, options);

        this.data.$blink.next(data);

        network.on("hoverNode", function (params) {
            console.log('hoverNode Event:', params);
        });
        network.on("blurNode", function (params) {
            console.log('blurNode event:', params);
        });
    }
}