package com.ecommerce.pawfund.service.imple;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ecommerce.pawfund.service.inter.ICloudinaryService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements ICloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "pawfund"));
        return uploadResult.get("secure_url").toString();
    }

     // Upload nhiều file và trả về danh sách URL
     public List<String> uploadFiles(List<MultipartFile> files) throws IOException {
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                System.out.println("Uploading file: " + file.getOriginalFilename() + 
                                " (size: " + file.getSize() + " bytes)");
                String fileUrl = uploadFile(file);
                fileUrls.add(fileUrl);
                System.out.println("Successfully uploaded: " + fileUrl);
            } catch (Exception e) {
                System.out.println("ERROR uploading file " + file.getOriginalFilename() + ": " + e.getMessage());
                throw e;
            }
        }
        return fileUrls;
    }

    public String uploadBytes(byte[] data, String filename) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(data, ObjectUtils.asMap(
            "folder", "pawfund",
            "public_id", filename
        ));
        return uploadResult.get("secure_url").toString();
    }
    
   
} 