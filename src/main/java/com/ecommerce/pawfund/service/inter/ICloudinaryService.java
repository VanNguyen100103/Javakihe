package com.ecommerce.pawfund.service.inter;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface ICloudinaryService {
    String uploadFile(MultipartFile file) throws IOException;
    List<String> uploadFiles(List<MultipartFile> files) throws IOException;
} 