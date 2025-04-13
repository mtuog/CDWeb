package com.example.BackEndSpring.service;

import com.example.BackEndSpring.model.Setting;
import com.example.BackEndSpring.repository.SettingRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingService {

    private final SettingRepository settingRepository;

    @Autowired
    public SettingService(SettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    public List<Setting> getAllSettings() {
        return settingRepository.findAll();
    }

    public Optional<Setting> getSettingById(Long id) {
        return settingRepository.findById(id);
    }

    public Optional<Setting> getSettingByKey(String key) {
        return settingRepository.findBySettingKey(key);
    }

    public List<Setting> getSettingsByGroup(String groupName) {
        return settingRepository.findByGroupName(groupName);
    }

    public String getSettingValue(String key, String defaultValue) {
        Optional<Setting> setting = settingRepository.findBySettingKey(key);
        return setting.map(Setting::getSettingValue).orElse(defaultValue);
    }

    @Transactional
    public Setting createSetting(Setting setting) {
        if (settingRepository.existsBySettingKey(setting.getSettingKey())) {
            throw new RuntimeException("Setting key already exists: " + setting.getSettingKey());
        }
        
        setting.setCreatedAt(LocalDateTime.now());
        setting.setUpdatedAt(LocalDateTime.now());
        return settingRepository.save(setting);
    }

    @Transactional
    public Setting updateSetting(String key, String value) {
        Optional<Setting> settingOpt = settingRepository.findBySettingKey(key);
        if (settingOpt.isPresent()) {
            Setting setting = settingOpt.get();
            setting.setSettingValue(value);
            setting.setUpdatedAt(LocalDateTime.now());
            return settingRepository.save(setting);
        }
        throw new RuntimeException("Setting not found with key: " + key);
    }

    @Transactional
    public Setting updateSetting(Long id, Setting settingDetails) {
        Setting setting = settingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setting not found with id: " + id));
        
        // Check if key is being changed and if it already exists
        if (!setting.getSettingKey().equals(settingDetails.getSettingKey()) 
                && settingRepository.existsBySettingKey(settingDetails.getSettingKey())) {
            throw new RuntimeException("Setting key already exists: " + settingDetails.getSettingKey());
        }
        
        setting.setSettingKey(settingDetails.getSettingKey());
        setting.setSettingValue(settingDetails.getSettingValue());
        setting.setGroupName(settingDetails.getGroupName());
        setting.setUpdatedAt(LocalDateTime.now());
        
        return settingRepository.save(setting);
    }

    @Transactional
    public void deleteSetting(Long id) {
        settingRepository.deleteById(id);
    }
} 