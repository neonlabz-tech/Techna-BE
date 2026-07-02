"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const modules_service_1 = require("./modules.service");
const create_module_dto_1 = require("./dto/create-module.dto");
const update_module_dto_1 = require("./dto/update-module.dto");
const add_resource_url_dto_1 = require("./dto/add-resource-url.dto");
const roles_decorator_1 = require("../decorators/roles.decorator");
const role_enum_1 = require("../enums/role.enum");
const public_decorator_1 = require("../auth/public.decorator");
let ModulesController = class ModulesController {
    constructor(modulesService) {
        this.modulesService = modulesService;
    }
    create(createModuleDto) {
        return this.modulesService.create(createModuleDto);
    }
    findAll(status) {
        return this.modulesService.findAll(status);
    }
    findPublished() {
        return this.modulesService.findPublished();
    }
    findOne(id) {
        return this.modulesService.findOne(id);
    }
    update(id, updateModuleDto) {
        return this.modulesService.update(id, updateModuleDto);
    }
    remove(id) {
        return this.modulesService.remove(id);
    }
    uploadResource(id, file, title) {
        return this.modulesService.uploadResource(id, file, title);
    }
    addResourceUrl(id, addResourceUrlDto) {
        return this.modulesService.addResourceUrl(id, addResourceUrlDto);
    }
    deleteResource(moduleId, resourceId) {
        return this.modulesService.deleteResource(moduleId, resourceId);
    }
    updateResource(moduleId, resourceId, title) {
        return this.modulesService.updateResource(moduleId, resourceId, title);
    }
    togglePublish(moduleId, resourceId) {
        return this.modulesService.toggleResourcePublish(moduleId, resourceId);
    }
};
exports.ModulesController = ModulesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_module_dto_1.CreateModuleDto]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "findPublished", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_module_dto_1.UpdateModuleDto]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/upload-resource'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file', 'title'],
            properties: {
                file: { type: 'string', format: 'binary' },
                title: { type: 'string', example: 'Lecture 01 notes' },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "uploadResource", null);
__decorate([
    (0, common_1.Post)(':id/add-resource-url'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_resource_url_dto_1.AddResourceUrlDto]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "addResourceUrl", null);
__decorate([
    (0, common_1.Delete)(':moduleId/resources/:resourceId'),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('resourceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "deleteResource", null);
__decorate([
    (0, common_1.Patch)(':moduleId/resources/:resourceId'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['title'],
            properties: {
                title: { type: 'string', example: 'Updated lecture notes' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('resourceId')),
    __param(2, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "updateResource", null);
__decorate([
    (0, common_1.Patch)(':moduleId/resources/:resourceId/toggle-publish'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('resourceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "togglePublish", null);
exports.ModulesController = ModulesController = __decorate([
    (0, common_1.Controller)('modules'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [modules_service_1.ModulesService])
], ModulesController);
//# sourceMappingURL=modules.controller.js.map