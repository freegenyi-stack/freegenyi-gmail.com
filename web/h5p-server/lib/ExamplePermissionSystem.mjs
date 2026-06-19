import {
  ContentPermission,
  GeneralPermission,
  TemporaryFilePermission,
  UserDataPermission,
} from "@lumieducation/h5p-server";

export default class ExamplePermissionSystem {
  async checkForUserData(actingUser, permission) {
    if (!actingUser || actingUser.role === "anonymous") return false;
    if (actingUser.role === "admin" || actingUser.role === "teacher") return true;
    return [
      UserDataPermission.EditFinished,
      UserDataPermission.EditState,
      UserDataPermission.ListStates,
      UserDataPermission.ViewState,
      UserDataPermission.ViewFinished,
    ].includes(permission);
  }

  async checkForContent(actingUser, permission) {
    if (!actingUser || actingUser.role === "anonymous") return false;
    if (actingUser.role === "admin" || actingUser.role === "teacher") {
      return [
        ContentPermission.Create,
        ContentPermission.Delete,
        ContentPermission.Download,
        ContentPermission.Edit,
        ContentPermission.Embed,
        ContentPermission.List,
        ContentPermission.View,
      ].includes(permission);
    }
    return [ContentPermission.List, ContentPermission.View].includes(permission);
  }

  async checkForTemporaryFile(user) {
    return Boolean(user && user.role && user.role !== "anonymous");
  }

  async checkForGeneralAction(actingUser, permission) {
    if (!actingUser || actingUser.role === "anonymous") return false;
    if (actingUser.role === "admin" || actingUser.role === "teacher") {
      return [
        GeneralPermission.InstallRecommended,
        GeneralPermission.UpdateAndInstallLibraries,
        GeneralPermission.CreateRestricted,
      ].includes(permission);
    }
    return false;
  }
}
