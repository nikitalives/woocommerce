<?php

namespace migration;

abstract class WCMP_Upgrade_Migration
{
    /**
     * @var array
     */
    protected $optionSettingsMap = [];

    protected function __construct()
    {
        $this->import();
        $this->migrate();
        $this->setOptionSettingsMap();
        $this->save();
    }

    /**
     * Import any dependencies you might need using this function
     */
    protected function import(): void {}

    /**
     * Put the migration logic in this function.
     */
    protected function migrate(): void {}

    /**
     *
     */
    protected function setOptionSettingsMap(): void {}

    /**
     * @param array      $map
     * @param array      $newSettings
     * @param array|null $oldSettings
     *
     * @return array
     */
    protected function migrateSettings(array $map, array $newSettings, array $oldSettings = null): array
    {
        $oldSettings = $oldSettings ?? $newSettings;

        foreach ($map as $oldSetting => $newSetting) {
            if (array_key_exists($oldSetting, $oldSettings)) {
                $newSettings[$newSetting] = $oldSettings[$oldSetting];
            }

            if (array_key_exists($oldSetting, $newSettings)) {
                unset($newSettings[$oldSetting]);
            }
        }

        return $newSettings;
    }

    /**
     * @param array $map
     * @param array $newSettings
     *
     * @return array
     */
    protected function removeOldSettings(array $map, array $newSettings): array
    {
        foreach ($map as $oldSetting => $newSetting) {
            if (array_key_exists($oldSetting, $newSettings)) {
                unset($newSettings[$oldSetting]);
            }
        }
        return $newSettings;
    }

    protected function save()
    {
        foreach ($this->optionSettingsMap as $option => $settings) {
            if (get_option($option) === false) {
                add_option($option, $settings);
            } else {
                update_option($option, $settings);
            }
        }
    }
}
