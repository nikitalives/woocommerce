<?php

use MyParcelNL\Sdk\src\Model\Consignment\BpostConsignment;
use MyParcelNL\Sdk\src\Model\Consignment\DPDConsignment;
use WPO\WC\MyParcelBE\Compatibility\Order;
use WPO\WC\MyParcelBE\Compatibility\WC_Core;
use WPO\WC\MyParcelBE\Entity\DeliveryOptions;

if (! defined('ABSPATH')) {
    exit;
} // Exit if accessed directly

if (class_exists('WCMP_Checkout')) {
    return new WCMP_Checkout();
}

/**
 * Frontend views
 */
class WCMP_Checkout
{
    /**
     * WCMP_Checkout constructor.
     */
    public function __construct()
    {
        add_action("wp_enqueue_scripts", [$this, "enqueue_frontend_scripts"]);

        // Save delivery options data
        add_action("woocommerce_checkout_update_order_meta", [$this, "save_delivery_options"], 10, 2);
    }

    /**
     * Load styles & scripts
     */
    public function enqueue_frontend_scripts()
    {
        // return if not checkout or order received page
        if (! is_checkout() && ! is_order_received_page()) {
            return;
        }

        // if using split address fields
        if (WCMP()->setting_collection->isEnabled('use_split_address_fields')) {
            wp_enqueue_script(
                'wcmp-checkout-fields',
                WCMP()->plugin_url() . '/assets/js/wcmp-checkout-fields.js',
                ['wc-checkout'],
                WC_MYPARCEL_BE_VERSION
            );
        }

        // Don't load the delivery options scripts if it's disabled
        if (! WCMP()->setting_collection->isEnabled(WCMP_Settings::SETTING_DELIVERY_OPTIONS_ENABLED)) {
            return;
        }

        wp_enqueue_script(
            'wc-myparcelbe',
            WCMP()->plugin_url() . '/assets/js/myparcel.js',
            [],
            WC_MYPARCEL_BE_VERSION
        );

        wp_enqueue_script(
            'wc-myparcelbe-frontend',
            WCMP()->plugin_url() . '/assets/js/wcmp-frontend.js',
            ['wc-myparcelbe'],
            WC_MYPARCEL_BE_VERSION
        );

        $this->inject_delivery_options_variables();
    }

    /**
     * Localize variables into the delivery options scripts.
     */
    public function inject_delivery_options_variables()
    {
        wp_localize_script(
            "wc-myparcelbe-frontend",
            "MyParcelDisplaySettings",
            [
                // Convert true/false to int for JavaScript
                "isUsingSplitAddressFields" => (int) WCMP()->setting_collection->isEnabled(
                    WCMP_Settings::SETTING_USE_SPLIT_ADDRESS_FIELDS
                ),
            ]
        );

        wp_localize_script(
            "wc-myparcelbe",
            "MyParcelDeliveryOptions",
            [
                "shippingMethods" => $this->get_delivery_options_shipping_methods(),
                "alwaysDisplay"   => (int) $this->get_delivery_options_always_display(),
                "hiddenInputName" => DeliveryOptions::HIDDEN_INPUT_NAME,
            ]
        );

        wp_localize_script(
            'wc-myparcelbe',
            'MyParcelConfig',
            $this->get_delivery_options_config()
        );

        // Load the checkout template.
        add_action(
            apply_filters(
                'wc_wcmp_delivery_options_location',
                WCMP()->setting_collection->getByName(WCMP_Settings::SETTING_CHECKOUT_POSITION)
            ),
            [$this, 'output_delivery_options'],
            10
        );
    }

    /**
     * @return string
     */
    public function get_delivery_options_shipping_methods()
    {
        $packageTypes = WCMP()->setting_collection->getByName(WCMP_Settings::SETTING_SHIPPING_METHODS_PACKAGE_TYPES);

        echo "<pre>";
        var_dump($packageTypes);
        echo "</pre>";

        $shipping_methods = [];

        if (array_key_exists(WCMP_Export::PACKAGE, $packageTypes ?? [])) {
            // Shipping methods associated with parcels = enable delivery options
            $shipping_methods = $packageTypes[WCMP_Export::PACKAGE];
        }

        return json_encode($shipping_methods);
    }

    /**
     * @return bool
     */
    public function get_delivery_options_always_display(): bool
    {
        if (WCMP()->setting_collection->getByName(WCMP_Settings::SETTING_DELIVERY_OPTIONS_DISPLAY) === 'all_methods') {
            return true;
        }

        return false;
    }

    /**
     * Get the delivery options config in JSON for passing to JavaScript.
     *
     * @return false|mixed|string|void
     */
    public function get_delivery_options_config()
    {
        $settings = WCMP()->setting_collection;

        $carriers = $this->get_carriers();

        $myParcelConfig = [
            "config"  => [
                "carriers" => $carriers,
                "platform" => "belgie",
                "locale"   => "nl-BE",
                "currency" => get_woocommerce_currency(),
            ],
            "strings" => [
                "addressNotFound"       => _wcmp('Address details are not entered'),
                "city"                  => _wcmp('City'),
                "closed"                => _wcmp('Closed'),
                "deliveryTitle"         => _wcmp('Standard delivery title'),
                "headerDeliveryOptions" => strip_tags(
                    $settings->getStringByName(WCMP_Settings::SETTING_HEADER_DELIVERY_OPTIONS_TITLE)
                ),
                "houseNumber"           => _wcmp('House number'),
                "openingHours"          => _wcmp('Opening hours'),
                "pickUpFrom"            => _wcmp('Pick up from'),
                "pickupTitle"           => _wcmp('Pickup'),
                "postcode"              => _wcmp('Postcode'),
                "retry"                 => _wcmp('Retry'),
                "wrongHouseNumberCity"  => _wcmp('Postcode/city combination unknown'),
                "signatureTitle"        => $settings->getStringByName(WCMP_Settings::SETTING_SIGNATURE_TITLE),
            ],
        ];

        foreach ($carriers as $carrier) {
            $allowDeliveryOptions  = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_DELIVERY_ENABLED;
            $allowPickupLocations  = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_PICKUP_ENABLED;
            $allowSignature        = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_SIGNATURE_ENABLED;
            $cutoffTime            = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_CUTOFF_TIME;
            $deliveryDaysWindow    = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_DELIVERY_DAYS_WINDOW;
            $dropOffDays           = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_DROP_OFF_DAYS;
            $dropOffDelay          = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_DROP_OFF_DELAY;
            $pricePickup           = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_PICKUP_FEE;
            $priceSignature        = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_SIGNATURE_FEE;
            $priceSaturdayDelivery = "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_SATURDAY_DELIVERY_FEE;

            $myParcelConfig["config"]["carrierSettings"][$carrier] = [
                "allowDeliveryOptions" => $settings->isEnabled($allowDeliveryOptions),
                "allowPickupLocations" => $settings->isEnabled($allowPickupLocations),
                "allowSignature"       => $settings->getBooleanByName($allowSignature),
                "cutoffTime"           => $settings->getStringByName($cutoffTime),
                "deliveryDaysWindow"   => $settings->getIntegerByName($deliveryDaysWindow),
                "dropOffDays"          => $settings->getByName($dropOffDays),
                "dropOffDelay"         => $settings->getIntegerByName($dropOffDelay),

                "pricePickup"           => $settings->getFloatByName($pricePickup),
                "priceSignature"        => $settings->getFloatByName($priceSignature),
                "priceSaturdayDelivery" => $settings->getFloatByName($priceSaturdayDelivery),
            ];
        }

        return json_encode($myParcelConfig, JSON_UNESCAPED_SLASHES);
    }

    /**
     * Output the delivery options template.
     */
    public function output_delivery_options()
    {
        do_action('woocommerce_myparcelbe_before_delivery_options');
        require_once(WCMP()->includes . '/views/html-delivery-options-template.php');
        do_action('woocommerce_myparcelbe_after_delivery_options');
    }

    /**
     * Get the array of enabled carriers by checking if they have either delivery or pickup enabled.
     *
     * @return array
     */
    private function get_carriers(): array
    {
        $settings = WCMP()->setting_collection;
        $carriers = [];

        foreach ([BpostConsignment::CARRIER_NAME, DPDConsignment::CARRIER_NAME] as $carrier) {
            if ($settings->getByName("{$carrier}_" . WCMP_Settings::SETTING_CARRIER_PICKUP_ENABLED)
                || $settings->getByName(
                    "{$carrier}_" . WCMP_Settings::SETTING_CARRIER_DELIVERY_ENABLED
                )) {
                $carriers[] = $carrier;
            }
        }

        return $carriers;
    }

    /**
     * Save delivery options to order when used
     *
     * @param int   $order_id
     * @param array $posted
     *
     * @return void
     */
    public static function save_delivery_options($order_id)
    {
        $order = WC_Core::get_order($order_id);

        /**
         * Save the order weight here because it's easier than digging through order data after creating it.
         *
         * @see https://businessbloomer.com/woocommerce-save-display-order-total-weight/
         */
        $weight = WC()->cart->get_cart_contents_weight();
        Order::update_meta_data($order, '_wcmp_order_weight', $weight);

        if ($_POST["myparcelbe_highest_shipping_class"] !== null) {
            Order::update_meta_data(
                $order,
                "_myparcelbe_highest_shipping_class",
                $_POST["myparcelbe_highest_shipping_class"]
            );
        } else {
            if (isset($_POST["shipping_method"])) {
                Order::update_meta_data(
                    $order,
                    "_myparcelbe_highest_shipping_class",
                    $_POST["shipping_method"][0]
                );
            }
        }

        if (isset($_POST["myparcelbe-signature-selector"])) {
            Order::update_meta_data(
                $order,
                "_myparcelbe_signature",
                'on'
            );
        }

        if (isset($_POST[DeliveryOptions::HIDDEN_INPUT_NAME])) {
            Order::update_meta_data(
                $order,
                DeliveryOptions::HIDDEN_INPUT_NAME,
                $_POST[DeliveryOptions::HIDDEN_INPUT_NAME]
            );
        }
    }
}

return new WCMP_Checkout();
