import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FileResponse } from "../../core/models/file-response.model";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: "root"
})
export class FileService {

    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8080/api/file';

    upload(file : File):Observable<FileResponse>{

        const reader = new FileReader();


        const formData = new FormData();

        formData.append('file', file);

        return this.http.post<FileResponse>(`${this.baseUrl}/upload`, formData);



    }

}