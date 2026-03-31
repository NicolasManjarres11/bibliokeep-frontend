import { TestBed } from "@angular/core/testing";
import { FileService } from "./file.service";
import { FileResponse } from "../../core/models/file-response.model";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { vi } from "vitest";
import { environment } from "../../../environments/environment";

describe("FileService", () => {
    let httpMock: HttpTestingController;
    let service: FileService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FileService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(FileService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it("Should compress and convert image to webp", async () => {
        const mockFile = new File([""], "test.png", { type: "image/png" });
        const expectedBlob = new Blob([""], { type: "image/webp" });

        const compressSpy = vi
            .spyOn(service, "compressImage")
            .mockResolvedValue(expectedBlob);

        const result = await service.compressImage(mockFile, 100);

        expect(compressSpy).toHaveBeenCalledWith(mockFile, 100);
        expect(result.type).toBe("image/webp");
    });

    it('should send a POST request with FormData', () => {

        const mockFile = new File([''], 'test.png', {type: 'image/png'});

        const mockResponse : FileResponse = {
            filename: 'file-image.webp',
            url: '/content/file-image.webp',
            size: 10
        };

        service.upload(mockFile).subscribe({
            next: (data) => {
                expect(data).toEqual(mockResponse);
            },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/file/upload`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body instanceof FormData).toBe(true);

        req.flush(mockResponse);
    });
});