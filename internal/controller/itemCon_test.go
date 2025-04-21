package controller

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"project/internal/model"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

const (
	basePath    = "/items/"
	contentType = "Content-Type"
	appJSON     = "application/json"
)

func setupApp() *fiber.App {
	app := fiber.New()
	ctrl := NewController()

	itemGroup := app.Group("/items")
	itemGroup.Get("/", ctrl.GetAll)
	itemGroup.Get("/:id", ctrl.GetByID)
	itemGroup.Post("/", ctrl.Create)
	itemGroup.Put("/:id", ctrl.Update)
	itemGroup.Delete("/:id", ctrl.Delete)

	return app
}

func TestGetAll(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest(http.MethodGet, basePath, nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var items []model.Item
	err = json.NewDecoder(resp.Body).Decode(&items)
	assert.NoError(t, err)
	assert.Len(t, items, 2)
}

func TestGetByID(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest(http.MethodGet, basePath+"123", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var item model.Item
	err = json.NewDecoder(resp.Body).Decode(&item)
	assert.NoError(t, err)
	assert.Equal(t, "123", item.ID)
}

func TestCreate(t *testing.T) {
	app := setupApp()

	body := model.Item{Name: "Created Item"}
	jsonBody, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, basePath, bytes.NewReader(jsonBody))
	req.Header.Set(contentType, appJSON)

	resp, err := app.Test(req)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var item model.Item
	err = json.NewDecoder(resp.Body).Decode(&item)
	assert.NoError(t, err)
	assert.Equal(t, "Created Item", item.Name)
	assert.NotEmpty(t, item.ID)
}

func TestCreateInvalidBody(t *testing.T) {
	app := setupApp()

	invalidJSON := []byte(`{ invalid `)
	req := httptest.NewRequest(http.MethodPost, basePath, bytes.NewReader(invalidJSON))
	req.Header.Set(contentType, appJSON)

	resp, err := app.Test(req)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)

	var body map[string]string
	err = json.NewDecoder(resp.Body).Decode(&body)
	assert.NoError(t, err)
	assert.Equal(t, "invalid body", body["error"])
}

func TestUpdate(t *testing.T) {
	app := setupApp()

	body := model.Item{Name: "Updated Item"}
	jsonBody, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPut, basePath+"321", bytes.NewReader(jsonBody))
	req.Header.Set(contentType, appJSON)

	resp, err := app.Test(req)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var item model.Item
	err = json.NewDecoder(resp.Body).Decode(&item)
	assert.NoError(t, err)
	assert.Equal(t, "321", item.ID)
	assert.Equal(t, "Updated Item", item.Name)
}

func TestUpdateInvalidBody(t *testing.T) {
	app := setupApp()

	invalidJSON := []byte(`{ nope }`)
	req := httptest.NewRequest(http.MethodPut, basePath+"999", bytes.NewReader(invalidJSON))
	req.Header.Set(contentType, appJSON)

	resp, err := app.Test(req)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)

	var body map[string]string
	err = json.NewDecoder(resp.Body).Decode(&body)
	assert.NoError(t, err)
	assert.Equal(t, "invalid body", body["error"])
}

func TestDelete(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest(http.MethodDelete, basePath+"999", nil)
	resp, err := app.Test(req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var result map[string]string
	err = json.NewDecoder(resp.Body).Decode(&result)
	assert.NoError(t, err)
	assert.Contains(t, result["message"], "Deleted 999")
}
